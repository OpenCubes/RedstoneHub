var util = require('util'),
    crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy,
    BadRequestError = require('passport-local').BadRequestError;

module.exports = function (schema, options) {
    options = options || {};

    // Populate field names with defaults if not set
    options.usernameField = options.usernameField || 'username';

    // option to convert username to lowercase when finding
    options.usernameLowerCase = options.usernameLowerCase || false;

    options.hashField = options.hashField || 'hash';
    options.incorrectPasswordError = options.incorrectPasswordError || 'Incorrect password';
    options.incorrectUsernameError = options.incorrectUsernameError || 'Incorrect username';
    options.missingUsernameError = options.missingUsernameError || 'Field %s is not set';
    options.missingPasswordError = options.missingPasswordError || 'Password argument not set!';
    options.userExistsError = options.userExistsError || 'User already exists with name %s';

    var schemaFields = {};
    if (!schema.path(options.usernameField)) {
        schemaFields[options.usernameField] = String;
    }
    schemaFields[options.hashField] = String;
    schemaFields[options.saltField] = String;

    schema.add(schemaFields);

 /*   schema.pre('save', function (next) {
        // if specified, convert the username to lowercase
        if (options.usernameLowerCase) {
            this[options.usernameField] = this[options.usernameField].toLowerCase();
        }

        next();
    });
*/
    schema.methods.setPassword = function (password, cb) {
        console.log('setting password...');
        if (!password) {
            console.log('missing password... exiting');
            return cb(new BadRequestError(options.missingPasswordError));
        }

        var self = this;
        var shasum = crypto.createHash('sha256');
        shasum.update(password);
        var d = shasum.digest('hex');
        self.set(options.hashField, d);
        console.log('...done');
        cb(null, self);
    };

    schema.methods.authenticate = function (password, cb) {

        console.log('auth...');
        var self = this;
        var shasum = crypto.createHash('sha256');
        shasum.update(password);
        var d = shasum.digest('hex');
        if (d === self.get(options.hashField)) {

            return cb(null, self);
        }
        else {
            return cb(null, false, {
                message: options.incorrectPasswordError
            });
        }


    };

    schema.statics.authenticate = function () {
        var self = this;

        return function (username, password, cb) {
            self.findByUsername(username, function (err, user) {
                if (err) {
                    console.log(err);
                    return cb(err);
                }

                if (user) {
                    console.log(user);
                    return user.authenticate(password, cb);
                }
                else {
                    console.log('90:error');
                    return cb(null, false, {
                        message: options.incorrectUsernameError
                    })
                }
            });
        }
    };

    schema.statics.serializeUser = function () {
        return function (user, cb) {
            cb(null, user.get(options.usernameField));
        }
    };

    schema.statics.deserializeUser = function () {
        var self = this;

        return function (username, cb) {
            self.findByUsername(username, cb);
        }
    };

    schema.statics.register = function (user, password, cb) {

        // Create an instance of this in case user isn't already an instance
        if (!(user instanceof this)) {
            user = new this(user);

        }

        if (!user.get(options.usernameField)) {
            console.log(options.missingUsernameError);
            return cb(new BadRequestError(util.format(options.missingUsernameError, options.usernameField)));
        }

        var self = this;
        console.log('seeking...');
        self.findByUsername(user.get(options.usernameField), function (err, existingUser) {
            if (err) {
                console.log(err);
                return cb(err);
            }

            if (existingUser) {
                console.log(options.userExistsError);
                return cb(new BadRequestError(util.format(options.userExistsError, user.get(options.usernameField))));
            }

            user.setPassword(password, function (err, user) {
                if (err) {
                    console.log(err);
                    return cb(err);
                }

                    console.log('saving...');
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        return cb(err);
                    }
                    console.log('ok');

                    cb(null, user);
                });
            });
        });
    };

    schema.statics.findByUsername = function (username, cb) {
        var queryParameters = {};

        // if specified, convert the username to lowercase
        if (options.usernameLowerCase) {
            username = username.toLowerCase();
        }

        queryParameters[options.usernameField] = username;

        var query = this.findOne(queryParameters);
        if (options.selectFields) {
            query.select(options.selectFields);
        }

        query.exec(cb);
    };

    schema.statics.createStrategy = function () {
        return new LocalStrategy(options, this.authenticate());
    };
};
