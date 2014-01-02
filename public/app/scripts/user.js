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