
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        }
        else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
var editor;
$(document).ready(function () {
    $(".input_container").parent().addClass("selected");
    $("form").on("submit", function (event) {
        event.preventDefault();
        var opts = {
            lines: 9, // The number of lines to draw
            length: 0, // The length of each line
            width: 15, // The line thickness
            radius: 20, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 90, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 100, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        var target = document.getElementById('loader');
        var spinner = new Spinner(opts).spin(target);
        var form = $('form').serializeObject()
        form.desc = editor.exportFile();
        console.log(form)
        $.ajax({
            url: '/ajax/addmod/',
            type: 'POST',
            data: {
                form: JSON.stringify(form)
            },
            dataType: 'json',
            success: function (data) {
                $('#loader').text('');
                if (data) {
                    $.each(data, function (i, v) {
                        var e = $('[name="' + v.property + '"]');
                        e.addClass('invalid');
                    });
                    setTimeout(function () {
                        $.each(data, function (i, v) {
                            var e = $('[name="' + v.property + '"]');
                            e.removeClass('invalid');
                        });
                    }, 1000);
                }
            },
            error: function (jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
        })
    });
    $('textarea').autosize();
    editor = new EpicEditor();
    editor.load({
        clientSideStorage: false,
        file: {
            defaultContent: 'The description should be written in markdown. To preview or switch to fullscrenn mod, go at the end of the area.: \n# This is a title'
        },
        autogrow: true
    });
});