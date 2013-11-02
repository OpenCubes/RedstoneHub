$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
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
$.fn.getScroll = function () {
     navigator.sayswho = (function() {
        var N = navigator.appName,
            ua = navigator.userAgent,
            tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        return M;
    })();

    var headerOffset = jQuery(".main-header").height(),
        blockMenu = jQuery(".block-menu"),
        nameNavigator = navigator.sayswho[0];

    if (nameNavigator == "Chrome") {
        var bodyelem = jQuery("body");
    }

    else if (nameNavigator == "Firefox") {
        var bodyelem = jQuery("body, html");
    }

    else if (nameNavigator == "Safari") {
        var bodyelem = jQuery(document);
    }

    else if (nameNavigator == "MSIE") {
        var bodyelem = jQuery(window);
    }
    return bodyelem;
}
var addCss = function(url){
    $('<link>')
  .appendTo($('head'))
  .attr({type : 'text/css', rel : 'stylesheet'})
  .attr('href', url);
}
var modHtml = '';
var displayUpload = function(){
        modHtml =  $('#main').html();
        History.pushState({page: 'upload', title: 'OpenCubes - Upload'}, null, 'upload'); // logs {}, '', "?state=4"
        $('<link>').appendTo($('head')).attr({
            type: 'text/css',
            rel: 'stylesheet'
        }).attr('href', '/stylesheets/dropkick.css');
        var width = $('#main').css('width');
        var height = $('#main').css('height');
        $('#main').html('<form class="form-container">' +
        '<h4>Name</h4>'+
        '<div id="general-info">'+
            '<div>'+
                '<input type="text" name="name" class="form-field"/>'+
                '<span id="legend"> Make it GOOD</span>'+
            '</div>'+
            '<div id="cat">'+
                '<label>Category</label>'+
                '<select name="category" class="select" tabindex="2">'+
                    '<option value="cheats">Cheats</option>'+
                    '<option value="decoration">Decoration</option>'+
                    '<option value="fixes">Fixes</option>'+
                    '<option value="gameplay">Gameplay</option>'+
                    '<option value="gui">GUI</option>'+
                    '<option value="misc">Misc</option>'+
                    '<option value="mobs">Mobs</option>'+
                    '<option value="sounds">Sounds</option>'+
                    '<option value="world">World</option>'+
                '</select>'+
            '</div>'+
        '</div>'+
        '<label class="form-title"><h4>Summary</h4></label>'+
        '<textarea id="desc" name="sum" class="form-field"></textarea>'+
        '<label class="form-title"><h4>Description</h4></label>' +
        '<div id="epiceditor"></div>'+
        '</form>'+
        '<div id="send_bottom">'+
            '<button class="ladda-button" data-style="expand-right" onclick="$(\'form\').submit()"><span class="ladda-label">Submit</span></button>'+
        '</div>');

        $('form').css({'opacity': '0'});
        $('#epiceditor').height(500);
        require(["javascripts/epiceditor/js/epiceditor.js", "javascripts/markdown.js", "javascripts/ladda.min.js", "javascripts/jquery.dropkick-min.js"], function(eeditor, markd, Ladda, dk) {
            var editor;
            addCss('/stylesheets/dropkick.css');
            $(".input_container").parent().addClass("selected");
            $('.select').dropkick();
            $("form").unbind('submit').on("submit", function(event) {
                event.preventDefault();
                var form = $('form').serializeObject();
                form.desc = editor.exportFile();
                // Create a new instance of ladda for the specified button
                var l = Ladda.create(document.querySelector('.ladda-button'));

                // Start loading
                l.start();
                var self = this;

                $.ajax({
                    url: '/ajax/addmod/',
                    type: 'POST',
                    data: {
                        form: JSON.stringify(form)
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data) {
                            $.each(data, function(i, v) {
                                var e = $('[name="' + v.property + '"]');
                                e.addClass('invalid');
                            });
                            $().getScroll().scrollTop(1);
                            setTimeout(function() {
                                $.each(data, function(i, v) {
                                    var e = $('[name="' + v.property + '"]');
                                    e.removeClass('invalid');
                                });
                            }, 3000);
                        }
                        // Stop loading
                        l.stop();
                        $.off(self);

                    },
                    error: function(jqXHR, textStatus, err) {
                        alert('text status ' + textStatus + ', err ' + err);
                        // Stop loading
                        l.stop();

                    }
                });
            });
            $('textarea').autosize();
            console.log(markdown);
            editor = new EpicEditor({
                container: 'epiceditor',
                textarea: null,
                basePath: 'epiceditor',
                clientSideStorage: false,
                localStorageName: 'epiceditor',
                useNativeFullscreen: true,
                parser: markdown.toHTML,
                file: {
                    name: 'epiceditor',
                    defaultContent: '# This is a title\n\nThe description should be written in markdown. '+
                    '\nTo preview or switch to fullscreen mod, go at the end of the area (follow the arrow).\n**You should not put here changelog, downloads or features list. OpenKubes has a built-in manager for that.** \n\n##This is another title\n\n###...and subtitle\n\n'+
                    '##  Code \n\n\nIndented with for spaces, it is a code\n\n     class HelloWorld {\n     public static void main(String[] args) {\n         System.out.println("Hello world!");\n     }'+
                    '\n    }\n\n## Quotes\n\n\nYou can also do quoting by adding > at the beginning of the text\n'+
                    '\n> Markdown is a lightweight markup language, originally created by John Gruber "allowing people '+
                    '\n to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)"'+
                    '\nsMarkdown formatted text should be readable as-is, without looking like it\'s been marked up with tags or formatting instructions, '+
                    'unlike text which has been formatted with a Markup language, such as HTML, which has obvious tags and formatting instructions.'+
                    ' Markdown is a formatting syntax for text that can be read by humans and can be easily converted to HTML.\n\n_(Wikipedia)_'+
                    '\n\n## Format\n\n\nThere are mutliple format possibilities : \n\n - A list is marked with a \'-\' at the beginning\n - An ordered list with 1. or 2.\n'+
                    ' - You can make the text **bold** by putting \'**\' at the beginning and at the end of the text\n - _Italic_ is also possible with \'_\'',
                },
                theme: {
                    base: '/themes/base/epiceditor.css',
                    preview: '/themes/preview/preview-dark.css',
                    editor: '/themes/editor/epic-dark.css'
                },
                button: {
                    preview: true,
                    fullscreen: true,
                    bar: "auto"
                },
                focusOnLoad: false,
                shortcut: {
                    modifier: 18,
                    fullscreen: 70,
                    preview: 80
                },
                string: {
                    togglePreview: 'Toggle Preview Mode',
                    toggleEdit: 'Toggle Edit Mode',
                    toggleFullscreen: 'Enter Fullscreen'
                },
                autogrow: true
            } );
            editor.load(function() {
            editor.preview();
            });
            
            $('form').css({'opacity': '1'});
            // alert('Hi');
            //  editor.importFile('mod.md', 'The description should be written in markdown. To preview or switch to fullscrenn mod, go at the end of the area.: \n# This is a title');
        });

};
var displayView = function(mod){
    
}
var points = 25,
    delay = 100;
var pos = 0;
var removePoints = function(n) {
    if (pos <= points) {
        $('#' + n).remove();
        pos++;
        n++;
        setTimeout(function() {
            removePoints(n);
        }, delay + 3);
    }
    else {

        $('body').css('opacity', '1');
        $('body').css('background-color', old);
    }
};
var displayBrowse = function() {
    if (modHtml === '') {
        var mods = $.ajax({
            type: "GET",
            url: "/ajax/getmods/?sort=-creation_date",
            error: function(err) {
                throw err;
            },
            success: function(mods) {
                var grid = $('#Grid');
                $.each(mods, function(i) {
                    var mod = mods[i];
                    var sum = mod.summary;
                    var l = mod.summary.length;
                    if(l > 160) {
                        
                        sum = sum.substring(0, 150);
                        sum = sum.trim() + '...' + sum.substr(l - 10, 9);
                    }
                    $('<li data-name="' + mod.name + '" data-version="1.6#1.5.63" class="mix '+mod.category_id+' mix_all">' +
                                    '<img  class="mod_logo" src="' + (mod.logo ? mod.logo : 'http://icons.iconarchive.com/icons/icojam/blue-bits/128/module-puzzle-icon.png') + '" />' +
                                    '<div class="modinfo">'+
                                        '<a href="/view/'+mod._id+'" class="view" data-id="'+mod._id+'" >'+
                                            '<h1 class="title">' + mod.name + '</h1>'+
                                            '<h6 class="summary text">' +sum + '</h6>'+
                                        '</a>'+
                                        '<div class="links">' +
                                            '<a href="/demo/'+mod._id+'" id="demo demo_'+mod._id+'" data-id="'+mod._id+'" data-icon="play">demo</a> '+
                                            '<a href="/view/'+mod._id+'" id="view view_'+mod._id+'" data-id="'+mod._id+'" data-icon="eye">view</a> '+
                                            '<a href="/cmod/'+mod._id+'" id="cmod cmod_'+mod._id+'" data-id="'+mod._id+'" data-icon="cartfill">cart</a> '+
                                            '<a href="/star/'+mod._id+'" id="star star_'+mod._id+'" data-id="'+mod._id+'" data-icon="stare">1,552,256</a> '+
                                        '</div>'+
                                    '</div>'+
                                '</li>').appendTo(grid);
                                
                });
                $('.view').click(function(e) {
                    switch (e.which) {
                    case 1:
                        e.preventDefault();
                        console.log('clicked');
                        
                        return false; // to allow the browser to know that we handled it.
                    case 2:
                        //middle Click
                        break;
                    case 3:
                        //right Click
                        break;
                    }
                });
                $(function() {

                    $('#Grid').mixitup({
                        targetSelector: '.mix',
                        filterSelector: '.filter',
                        sortSelector: '.sort',
                        buttonEvent: 'click',
                        effects: ['fade', 'scale', 'blur'],
                        listEffects: null,
                        easing: 'smooth',
                        layoutMode: 'list',
                        targetDisplayGrid: 'inline-block',
                        targetDisplayList: 'block',
                        gridClass: '',
                        transitionSpeed: 600,
                        showOnLoad: 'all',
                        sortOnLoad: false,
                        multiFilter: false,
                        filterLogic: 'or',
                        resizeContainer: true,
                        minHeight: 0,
                        failClass: 'fail',
                        perspectiveDistance: '3000',
                        perspectiveOrigin: '50% 50%',
                        animateGridList: true,
                        onMixLoad: null,
                        onMixStart: null,
                        onMixEnd: null
                    });
                });
            }
        });

        if (!mods) alert('error');
    }
    else {

        $('#main').html(modHtml);
    }
}
var handlePage = function(page) {
    switch (page) {
    case 'upload':
        displayUpload();
        break;
    case 'browsemods':
        displayBrowse();
        break;
    default:
        displayBrowse();
        break;
    }};
    var old;
    
var displayWait = function() {
    $('body').css('opacity', '0.5');
    old = $('body').css('background-color');
    $('body').css('background-color', 'White');
    for (var i = 0; i < points; i++) {
        var o = $('<div class="stylie" id="' + i + '"style="position: absolute">.</div>');
        o.css("-webkit-animation-delay", (i * delay) + "ms");
        o.css("animation-delay", (i * delay) + "ms");
        $('#loader').append(o);

    }
    setTimeout(function() {
        removePoints(pos)
    }, 1800);
};
jQuery(function($) {
   
        var bodyelem = $().getScroll();
        var lastScroll = bodyelem.scrollTop();
        var oldPos = $('aside').css('position');
        var oldTop = $('aside').css('top');
        $(window).scroll(function(e) {
            var newScroll = bodyelem.scrollTop();
            lastScroll = newScroll;
            if (lastScroll >= 50) {
                $('aside').css('position', 'fixed');
                $('aside').css('top', '0');
            }
            else {
                $('aside').css('position', oldPos);
                $('aside').css('top', oldTop);
            }
        });
});
    

$(document).ready(function() {
    //displayWait();
   // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var state = History.getState(); // Note: We are using History.getState() instead of event.state
        var page = state.data.page;
        console.log(page);
        handlePage(page);
    });
    
    var state = History.getState(); // Note: We are using History.getState() instead of event.state
    var page = state.data.page;
    console.log(page);
    handlePage(page);
    $('#upload-mod').on('click', function(event) {
       displayUpload();
    });
    
    var noReloads = true;

    if (noReloads) {
        $(window).bind("unload", function() {
            modHtml = '';
            var state = History.getState(); // Note: We are using History.getState() instead of event.state
            var page = state.data.page;
            console.log(page);
            handlePage(page);
            return false;
            
        });
    }
    $('.tooltip').attr('title', '<h2>Log In</h2><form action="/login" method="post"><div><label>Username</label><input name="username" type="text"></div><div><label>Password</label><input name="password" type="password"></div><div><input value="Log In" type="submit"></div></form>');

    $('.tooltip').tooltipster({
        trigger: 'click',
        interactive: true,
        interactiveTolerance: 2500,
        functionReady: function(origin, tooltip) {
            $("form").on("submit", function(event) {
                event.preventDefault();
                var form = $('form').serializeObject()
                console.log(form)
                $.ajax({
                    url: '/login/',
                    type: 'POST',
                    data: {
                        username: $('[name="username"]').val(),
                        password: $('[name="password"]').val()
                    },
                    dataType: 'json',
                    success: function(data) {
                        console.log(data)
                        $('#user').html('<div id="user"><a data-icon="u">Welcome ' + data.user.username + '</a><a href="/logout" id="logout" onclick="return false">Logout</a></div>');
                    },
                    error: function(jqXHR, textStatus, err) {
                        console.log('text status ' + textStatus + ', err ' + err);
                        if (err == 'Unauthorized') {
                            $('[type="password"]').val('');
                        }
                    }
                })

            })
        }
    });
    $("#logout").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            url: '/ajax/logout',
            type: 'GET',
            success: function(data) {
                console.log(data)
                $('#user').html('<div id="user"><a href="/register" data-icon="u">Register</a><a href="/login" onclick="return false" class="tooltip">Login</a></div>');
            },
            error: function(jqXHR, textStatus, err) {
                console.log('text status ' + textStatus + ', err ' + err);

            }
        })

    });
});

