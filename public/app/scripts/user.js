var upload = function(context) {
    if (!$.user || !$.user.logged) {
        alert('Please login in first');
    }
    else {
        context.partial('app/templates/upload.haml', function() {
            $('select').selectpicker();
            loadEditor(function() {
                $.get('/app/lib/editor/default.md', function(data) {
                    $('#editor').val(data)
                    var editor = new Editor({
                        element: document.getElementById('editor')
                    });
                    editor.render();
                    $(".screen").fadeOut(500);
                    $("#submit").unbind('click').on("click", function(event) {
                        event.preventDefault();
                        console.log('hi');
                        var form = $('form').serializeObject();
                        form.desc = editor.value ? editor.value : editor._rendered.value;

                        $.ajax({
                            url: '/ajax/addmod/',
                            type: 'POST',
                            data: {
                                form: JSON.stringify(form)
                            },
                            dataType: 'json',
                            success: function(data) {
                                console.log(data)
                                if (data.Status === 'Error') {
                                    switch (data.ErrorType) {
                                    case 'InvalidData':
                                        $.each(data.ErrorData, function(i, v) {
                                            var e = $('[name="' + v.property + '"]');
                                            e.parent().addClass('has-error');
                                        });
                                        $.scroll().scrollTop(1);;
                                        break;
                                    }
                                    noty({
                                        text: data.ErrorMessage,
                                        type: 'error',
                                        layout: 'bottomLeft'
                                    })
                                }
                                else if (data.Status === 'OK') {
                                    console.log(data);
                                    noty({
                                        text: 'Successfully uploaded. Redirecting...',
                                        type: 'success',
                                        layout: 'bottomLeft'
                                    });
                                    context.redirect('view/' + data.Slug);
                                }

                            },
                            error: function(jqXHR, textStatus, err) {
                                alert('text status ' + textStatus + ', err ' + err);
                            }
                        });
                    });
                })

            });
        });
    }
};

var edit = function(slug, context) {

    $.ajax({
        type: "GET",
        url: "/ajax/info/?slug=" + slug,
        error: function(err) {
            throw err;
        },
        success: function(mod) {
            console.log(mod);
            mod.canedit = $.user ? ($.user.logged ? ($.user.username === mod.author.username) : false) : false;
            console.log(mod.canedit);
            NProgress.inc()
            context.partial('/app/templates/edit.haml', mod, function() {
                NProgress.inc();

                $('#tabs a').click(function(e) {
                    e.preventDefault()
                    $(this).tab('show');
                });
                $.addCss('/app/lib/dynatree/skin/ui.dynatree.css');
                var r = []
                for (i in mod.files) {
                    var file = mod.files[i];
                    if (file.path) r.push({
                        title: file.path
                    });
                }
                $("#tree").dynatree({
                    onActivate: function(node) {},
                    persist: true,
                    children: r
                });
                $('select').selectpicker();
                $(":file").filestyle({
                    classButton: "btn btn-primary",
                    classInput: "form-control"
                });
                $(":file").change(function() {
                    var file = this.files[0];
                    var name = file.name;
                    var size = file.size;
                    var type = file.type;
                    //Your validation
                });
                $('#upload-file').click(function() {
                    $('.progress').addClass('active');
                    require(['socketio'], function(io) {
                        var  bandwidth = 51200;

                        var socket = io.connect();
                        if ($('#path').val() != "") {
                            
                            var FReader = new FileReader();
                            var Name = $('#path').val();
                            FReader.onload = function(evnt) {
                                socket.emit('Upload', {
                                    'Name': Name,
                                    Data: evnt.target.result,
                                    action: 'add',
                                    path: $('#path').val(),
                                    modid: mod._id
                                });
                            }
                            socket.emit('Start', {
                                'Name': Name,
                                'Size': $.SelectedFile.size
                            });
                            socket.on('MoreData', function(data) {
                                console.log('More...')
                                UpdateBar(data['Percent']);
                                var Place = data['Place'] * bandwidth ; //The Next Blocks Starting Position
                                var NewFile; //The Variable that will hold the new Block of Data
                                if ($.SelectedFile.webkitSlice) NewFile = $.SelectedFile.webkitSlice(Place, Place + Math.min(bandwidth , ($.SelectedFile.size - Place)));
                                else if ($.SelectedFile.slice) NewFile = $.SelectedFile.slice(Place, Place + Math.min(bandwidth , ($.SelectedFile.size - Place)));
                                else NewFile = $.SelectedFile.mozSlice(Place, Place + Math.min(bandwidth , ($.SelectedFile.size - Place)));
                                FReader.readAsBinaryString(NewFile);
                            });
                            socket.on('Done', function (data){
                                $('.progress').removeClass('active')
                                $('.progress-bar').addClass('progress-bar-success');
                                $('.progress').animate({
                                    width: 100 + "%"
                                })
                            });
                            function UpdateBar(percent) {
                                $('.progress-bar').animate({
                                    width: (percent < 6 ? percent + 5 : percent) + "%"
                                })
                            }
                        }
                        else {
                            alert("Please Select A File");
                            $('.progress').removeClass('active');
                        }

                    });
                });
                $(':file').on('change', function(evnt) {

                    $.SelectedFile = evnt.target.files[0];
                    $('#path').val($.SelectedFile.name);
                    $('.progress-bar').removeClass('progress-bar-success');
                });

                NProgress.done();
                $.app.trigger('load:done', {});
            });
        }
    });
};

var register = function(context) {
    $.ajax({
        url: '/shape',
        success: function(shape) {

            checkBot(context, shape, doRegister);
        }
    });
};


var checkBot = function(context, shape, callback) {
    console.log(shape);
    // Checks the cookie 
    if ($.cookie('isbot') && $.cookie('isbot') === 'no') {
        callback(context);
    }
    else {
        context.partial('/app/templates/captcha.haml', {
            shape: shape
        }, function() {
            $.app.trigger('load:done', {});
            $("#submit-captcha").unbind('click').on("click", function(event) {
                event.preventDefault();

                $.ajax({
                    url: '/isbot',
                    type: 'POST',
                    data: {
                        _points: $._points
                    },
                    dataType: 'json',
                    success: function(data) {
                        console.log(data);
                        if (data.status === 'ok') {
                            $.fn.motionCaptcha.success();
                            setTimeout(function() {
                                callback(context);
                            }, 1000);
                        }
                        else $.fn.motionCaptcha.error();

                    },
                    error: function(jqXHR, textStatus, err) {
                        alert('text status ' + textStatus + ', err ' + err);
                    }
                });
                return false;
            });

        });
    }
};

var doRegister = function(context) {

    context.partial('/app/templates/register.haml', function() {
        $.app.trigger('load:done', {});
        $("#submit-register").unbind('click').on("click", function(event) {
            event.preventDefault();

            var form = $('form').serializeObject();
            if (form.password !== form.password2) {

                noty({
                    text: 'The passwords don\'t match',
                    type: 'error',
                    layout: 'bottomLeft'
                });
                return $('#password1, #password2').addClass('hasError');
            }

            $.ajax({
                url: '/register',
                type: 'POST',
                data: form,
                dataType: 'json',
                success: function(data) {
                    console.log(data)
                    if (data.status === 'error') {
                        if (data.type === 'bot') {
                            noty({
                                text: 'It seems you are a bot. Try to clear your cookies and refresh the page',
                                type: 'error',
                                layout: 'bottomLeft'
                            });
                        }
                        else noty({
                            text: 'An error has occured.',
                            type: 'error',
                            layout: 'bottomLeft'
                        })
                    }
                    else if (data.status === 'done') {
                        noty({
                            text: 'Welcome !!',
                            type: 'success',
                            layout: 'bottomLeft'
                        });
                        return context.redirect('/browse');
                    }

                },
                error: function(jqXHR, textStatus, err) {
                    alert('text status ' + textStatus + ', err ' + err);
                }
            });
        });
    });
}
var stjs = '/components/sir-trevor-js/';

// Local deps, for a lighter main.js
var deps = {
    stjs: {
        'js': stjs + 'sir-trevor.min.js',
        'css-icons': stjs + 'sir-trevor-icons.css',
        'css': stjs + 'sir-trevor.css'
    },
    eventable: '/components/Eventable/eventable.js',
    underscore: '/components/underscore/underscore-min.js'
}

// STJs Loader
var loadEditor = function(callback) {
    require(['/app/lib/editor/editor.js'], function(e) {
        addCss('/app/lib/editor/editor.css');
        addCss('/app/lib/editor/yue.css');
        callback();

    });
}