module.exports = function(model, archive) {
    var routes = {};
    routes.pack = function(req, res) {

        var id = req.param('id');
        if (!id) return res.status.badRequest('No mod selected');
        model.Mod.findOne({
            '_id': id
        }, function(err, mod) {
            if (!mod || err) return res.status.internalServerError('No mod');

            var zip = new archive('zip');


            zip.on('error', function(err) {
                console.log(err);
            });

            res.set({
                "Content-Disposition": 'attachment; filename="' + mod.slug + '.zip"'
            });
            zip.pipe(res);
            // add local file
            var i;
            for (i in mod.files) {
                if (mod.files[i]._id && mod.files[i].path) {
                    var path = mod.files[i].path,
                        id = mod.files[i]._id;
                    zip.append(fs.createReadStream('./public/uploads/' + id), {
                        name: path
                    });
                    console.log('Adding file ' + id + ' to ' + path);
                }
            }
            zip.finalize(function(err, bytes) {
                if (err) {
                    return console.log(err);
                }

                console.log(bytes + ' total bytes');
            });
            // get everything as a buffer
            //  var buffer = zip.toBuffer();
            //var hash = crypto.createHash('sha256').update(buffer).digest('hex');
            //    console.log(mod.slug+"="+hash);
            // or write everything to disk
            //  zip.writeZip( /*target file name*/ "./cache/" + hash);
            //res.sendfile("./cache/" + hash);


        });
    };
    routes.managefiles = function(req, res) {
        var modid = req.param('modid');
        var action = req.param('action');
        var fileid = req.param('fileid');
        var path = req.param('path');
        if (!req.user) {
            res.status.unauthenticated('Who are you the proud lord say ?');
            return;
        }
        if (!modid && modid === '') {
            res.status.badRequest('No mod id');
        }
        else {
            var query = model.Mod.findOne({
                '_id': modid
            }).select('_id files name summary author');
            query.exec(function(err, doc) {
                if (err || !doc) {
                    res.status.internalServerError('Issues with database');
                }
                else {

                    // Check the user
                    var query = model.User.findOne({
                        '_id': req.user._id
                    }).select('_id name');

                    query.exec(function(err, user) {

                        // The mod's owner and the user have to be the same person
                        var userid = user._id.toString(),
                            author = doc.author.toString()
                            console.log(userid);
                        console.log(author);
                        if (author !== userid) {
                            res.status.forbidden('You are not the mod\'s owner');
                            return;
                        }

                        // actions add, del, edit, get
                        switch (action) {
                        case 'get':
                            console.log(doc.files)
                            var r = [],
                                i;
                            for (i in doc.files) {
                                var file = doc.files[i];
                                r.push({
                                    title: file.path
                                });
                            }
                            res.send(r);
                            break;
                        case 'add':
                            if (path !== '' && modid !== '') {
                                doc.files.push({
                                    _id: model.mongoose.Types.ObjectId(),
                                    path: path
                                });
                                doc.save(function(err) {
                                    if (err) return res.status.internalServerError('Can\'t save');
                                    res.status.accepted();
                                });

                            }
                            else res.status.badRequest('Wrong arguments');

                            break;
                        case 'del':
                            if (modid !== '') {

                            }
                            else res.status.badRequest('No mod specified');
                            break;
                        case 'edit':
                            if (modid !== '') {

                            }
                            else res.status.badRequest('No mod specified');
                            break;
                        default:
                            res.status.badRequest('No suitable action (' + action + ')');
                            break;

                        }
                    });
                }
            });
        }


    };
    routes.upload = function(req, res) {
        var user = req.user;
        if (user) {
            var enforce = require("enforce");
            var form = JSON.parse(req.body.form);
            var name = form.name,
                sum = form.sum,
                desc = form.desc,
                version = form.version,
                logo = form.logo,
                dl_link = form.dl_link,
                category = form.category;

            var checks = new enforce.Enforce({
                returnAllErrors: true
            });
            checks.add("name", enforce.notEmptyString('Name invalid')).add("name", enforce.ranges.length(2, undefined, "Name is too short")) // yes, you can have multiple validators per property
            /*.add("version", enforce.patterns.match(config.version_regex, undefined, 'Version is invalid'))*/
            .add("sum", enforce.notEmptyString('Summary is invalid')).add("desc", enforce.notEmptyString('Description is invalid'));
            checks.check({
                name: name,
                sum: sum,
                desc: desc,
                version: version,
                logo: logo,
                dl_link: dl_link

            },

            function(err) {
                if (!err) { // find each person with a last name matching 'Ghost'
                    var query = model.Category.findOne({
                        'slug': category
                    });
                    query.limit(1);
                    // execute the query at a later time
                    query.exec(function(err, cat) {
                        if (err) {
                            res.send({
                                'Status': 'Error',
                                'ErrorType': 'Exception',
                                'ErrorMessage': 'An exception has occured',
                                'ErrorData': err.name
                            });
                        }
                        var slug = name;
                        slug = slug.replace(new RegExp("([^\\w\\s\\-])", "gi"), '') // Matches non alpha numeric
                        .replace(new RegExp("\\s", "gi"), '-').toLowerCase();
                        var document = {
                            name: name,
                            summary: sum,
                            description: desc,
                            version: version,
                            logo: logo,
                            dl_link: dl_link,
                            creation_date: Date.now(),
                            category_id: cat._id,
                            author: user._id,
                            slug: slug
                        };
                        var doc = new model.Mod(document);
                        doc.save(function(err, mod) {
                            if (err) {
                                return err;
                            };
                            console.log(mod);
                            res.send({
                                'Status': 'OK',
                                'Slug': slug
                            });

                        });
                    })

                }
                else {
                    res.send({
                        'Status': 'Error',
                        'ErrorType': 'InvalidData',
                        'ErrorMessage': 'Some datas are invalid',
                        'ErrorData': err
                    });
                }
            });
        }
        else {
            res.send({
                'Status': 'Error',
                'ErrorType': 'Unauthorized',
                'ErrorMessage': 'Guest can\'t post mods',
                'ErrorData': ''
            });
        }
    };
    routes.star = function(req, res) {
        if (!req.user) {

            res.status.unauthenticated();
            return;
        }
        var modid = req.param('id');
        var userid = req.user.id;
        var query = model.Mod.findOne({
            '_id': modid
        });
        query.exec(function(err, doc) {
            if (err) {
                res.status.internalServerError(err);
            }
            else {
                if (doc.voters) for (var i = 0; i < doc.voters.length; i++) {
                    if (doc.voters[i].userid.equals(userid)) {
                        res.status.conflict('Already starred');
                        return;
                    }
                }
                else doc.voters = [];
                doc.voters.push({
                    userid: userid
                });
                if (!doc.vote_count) doc.vote_count = 0;
                doc.vote_count++;
                doc.save(function(err) {
                    if (err) {
                        res.status.internalServerError(err);
                        return;
                    }
                    res.status.accepted(doc);
                });
            }
        });

    };
    return routes;
}