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
                    text: 'The passwords don\'t match' ,
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
                        }else
                        noty({
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