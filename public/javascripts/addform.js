miu = {
    markdownTitle: function (markItUp, char) {
        heading = '';
        n = $.trim(markItUp.selection || markItUp.placeHolder).length;
        for (i = 0; i < n; i++) {
            heading += char;
        }
        return '\n' + heading + '\n';
    }
}
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
$(document).ready(function () {

    $("#addform").formToWizard();
    $('#form-id').motionCaptcha();
    $("form").on("submit", function (event) {
        event.preventDefault();
        console.log(JSON.stringify($('form').serializeObject()));

        $.ajax({
            url: '/ajax/addmod/',
            type: 'POST',
            data: {
                form: JSON.stringify($('form').serializeObject())
            },
            dataType: 'json',
            success: function (data) {
                alert('Success!')
            },
            error: function (jqXHR, textStatus, err) {
                alert('text status ' + textStatus + ', err ' + err)
            }
        })
    });
    $("#markItUp").markItUp({
        nameSpace: 'markdown',
        previewAutoRefresh: true, // Useful to prevent multi-instances CSS conflict
        previewParser: function (content) {
            return markdown.toHTML(content);
        },

        onShiftEnter: {
            keepDefault: false,
            openWith: '\n\n'
        },
        markupSet: [
            {
            name: 'First Level Heading',
            key: "1",
            placeHolder: 'Your title here...',
            closeWith: function (markItUp) {
                return miu.markdownTitle(markItUp, '=')
            }
        },
            {
            name: 'Second Level Heading',
            key: "2",
            placeHolder: 'Your title here...',
            closeWith: function (markItUp) {
                return miu.markdownTitle(markItUp, '-')
            }
        },
            {
            name: 'Heading 3',
            key: "3",
            openWith: '### ',
            placeHolder: 'Your title here...'
        },
            {
            name: 'Heading 4',
            key: "4",
            openWith: '#### ',
            placeHolder: 'Your title here...'
        },
            {
            name: 'Heading 5',
            key: "5",
            openWith: '##### ',
            placeHolder: 'Your title here...'
        },
            {
            name: 'Heading 6',
            key: "6",
            openWith: '###### ',
            placeHolder: 'Your title here...'
        },
            {
            separator: '---------------'
        },
            {
            name: 'Bold',
            key: "B",
            openWith: '**',
            closeWith: '**'
        },
            {
            name: 'Italic',
            key: "I",
            openWith: '_',
            closeWith: '_'
        },
            {
            separator: '---------------'
        },
            {
            name: 'Bulleted List',
            openWith: '- '
        },
            {
            name: 'Numeric List',
            openWith: function (markItUp) {
                return markItUp.line + '. ';
            }
        },
            {
            separator: '---------------'
        },
            {
            name: 'Picture',
            key: "P",
            replaceWith: '![[![Alternative text]!]]([![Url:!:http://]!] "[![Title]!]")'
        },
            {
            name: 'Link',
            key: "L",
            openWith: '[',
            closeWith: ']([![Url:!:http://]!] "[![Title]!]")',
            placeHolder: 'Your text to link here...'
        },
            {
            separator: '---------------'
        },
            {
            name: 'Quotes',
            openWith: '> '
        },
            {
            name: 'Code Block / Code',
            openWith: '(!(\t|!|`)!)',
            closeWith: '(!(`)!)'
        },
            {
            separator: '---------------'
        },
            {
            name: 'Preview',
            call: 'preview',
            className: "preview"
        }
        ]
    });
});