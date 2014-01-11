var Files = {};
module.exports = (function(socket, bandwidth, fs, model, Mod, User, uuid, callback) {
    callback = callback || (function() {});
    socket.on('connection', function(err, socket, session) {
        console.warn(session);
        socket.on('Start', function(data) { //data contains the variables that we passed through in the html file
            var Name = data['Name'];
            Files[Name] = { //Create a new Entry in The Files Variable
                FileSize: data['Size'],
                Data: "",
                Downloaded: 0,
                UID: uuid.v1()
            }
            var Place = 0;
            try {
                var Stat = fs.statSync('./temp/' + Name);
                if (Stat.isFile()) {
                    Files[Name]['Downloaded'] = Stat.size;
                    Place = Stat.size / bandwidth;
                }
            }
            catch (er) {} //It's a New File
            fs.open("./temp/" + Files[Name].UID, "a", 0755, function(err, fd) {
                if (err) {
                    console.log(err);
                }
                else {
                    Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                    socket.emit('MoreData', {
                        'Place': Place,
                        Percent: 0
                    });
                }
            });
        });
        socket.on('Upload', function(data) {
            var Name = data['path'];
            Files[Name]['Downloaded'] += data['Data'].length;
            Files[Name]['Data'] += data['Data'];
            if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
            {
                fs.write(Files[Name].Handler, Files[Name]['Data'], null, 'Binary', function(err, Writen) {
                    if (err) return console.log(err);

                    console.log('successfully deleted /tmp/');
                    var version = data['version'];
                    var modid = data['modid'];
                    var path = Name;
                    var user = session.passport.user;
                    if (!user) {
                        console.log('Who are you the proud lord say ?');
                        socket.emit('Failed', {
                            reason: 'Access Denied'
                        });
                        return;
                    }
                    if (!modid && modid === '') return socket.emit('Failed', {
                        reason: 'No mod selected'
                    });


                    else {
                        var query = Mod.findOne({
                            '_id': modid
                        }).select('_id files name summary author');
                        query.exec(function(err, doc) {
                            if (err || !doc) return socket.emit('Failed', {
                                reason: 'Issues with db'
                            });
                            else {

                                // Check the user
                                var query = User.findOne({
                                    'username': user
                                }).select('_id name');

                                query.exec(function(err, user) {

                                    // The mod's owner and the user have to be the same person
                                    if (!user._id.equals(doc.author)) {
                                        return socket.emit('Failed', {
                                            reason: 'You shall not pass !!!!'
                                        });
                                    }


                                    if (path !== '' && version !== '') {
                                        model.Mod.findOne({
                                            '_id': modid,
                                            'versions.name': version
                                        }).exec(function(err, mod) { // We try to find a matching version
                                            if (err) throw err;
                                            if (!mod) {
                                                // Therer is no matching version
                                                // We fetch the mof
                                                model.Mod.findById(modid).exec(function(err, mod) {
                                                    if (err) throw err;
                                                    if (mod) {
                                                        console.log('found mod')
                                                        mod.versions.push({
                                                            name: version,
                                                            _id: model.mongoose.Types.ObjectId()
                                                        });
                                                        var subdoc = mod.versions[mod.versions.length - 1];

                                                        console.log(subdoc)
                                                        mod.save(function(err, mod) {
                                                            if (err) throw err;
                                                            console.log(mod);
                                                            var file = new model.files({
                                                                version: subdoc._id,
                                                                path: path
                                                            });
                                                            file.save(function(err, doc) {
                                                                if (err) return socket.emit('Failed', {
                                                                    reason: 'Can\'t save'
                                                                });
                                                                socket.emit('Done', {
                                                                    'Percent': 100
                                                                });
                                                                console.log('doc is');
                                                                console.log(doc);
                                                                var inp = fs.createReadStream("./temp/" + Files[Name].UID);
                                                                var out = fs.createWriteStream("./public/uploads/" + doc._id);
                                                                inp.pipe(out);
                                                                inp.on('end', function() {
                                                                    fs.unlink("./temp/" + Files[Name].UID, function(err) {});
                                                                })
                                                            });
                                                        })
                                                    }
                                                })
                                            }
                                            else {
                                                console.log(mod);
                                                var file = new model.files({
                                                    version: mod.versions[0]._id,
                                                    path: path,
                                                    _id: model.mongoose.Types.ObjectId()
                                                });
                                                file.save(function(err, doc) {
                                                    if (err) return socket.emit('Failed', {
                                                        reason: 'Can\'t save'
                                                    });
                                                    socket.emit('Done', {
                                                        'Percent': 100
                                                    });
                                                    console.log('doc is');
                                                    console.log(doc);
                                                    var inp = fs.createReadStream("./temp/" + Files[Name].UID);
                                                    var out = fs.createWriteStream("./public/uploads/" + doc._id);
                                                    inp.pipe(out);
                                                    inp.on('end', function() {
                                                        fs.unlink("./temp/" + Files[Name].UID, function(err) {});
                                                    })
                                                });
                                            }
                                        })


                                    }
                                    else return socket.emit('Failed', {
                                        reason: 'Something is missing...'
                                    });
                                });
                            }
                        });
                    }

                });

            }
            else if (Files[Name]['Data'].length > 10485760) {
                //If the Data Buffer reaches 10MB
                fs.write(Files[Name].Handler, Files[Name]['Data'], null, 'Binary', function(err, Writen) {
                    Files[Name]['Data'] = ""; //Reset The Buffer
                    var Place = Files[Name]['Downloaded'] / bandwidth;
                    var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                    socket.emit('MoreData', {
                        'Place': Place,
                        'Percent': Percent
                    });
                });
            }
            else {
                var Place = Files[Name]['Downloaded'] / bandwidth;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', {
                    'Place': Place,
                    'Percent': Percent
                });
            }
        });
    });
});