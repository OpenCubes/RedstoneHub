     requirejs.config({
         'catcheError': true,
         baseUrl: '../../components/',
         paths: {
             'EpicEditor': 'EpicEditor/epiceditor/js/epiceditor.min',
             'markdown': 'markdown/lib/markdown',
             'ladda': 'Ladda/dist/ladda.min',
             'dropkick': 'jquery-dropkick2/jquery.dropkick-1.0.0',
             'Ladda': 'Ladda/dist/ladda.min',
             'jquery-autosize': 'jquery-autosize/jquery.autosize',
             'mixitup': 'mixitup/jquery.mixitup.min',
             'jquery': '//code.jquery.com/jquery-1.9.1',
             'jquery.migrate': '//code.jquery.com/jquery-migrate-1.2.1',
             'jqueryui': '//code.jquery.com/ui/1.10.3/jquery-ui',
             'history': 'history',
             'history.js': 'history',
             'spin': 'spin.js/dist/spin',
             'jquery.qtip': 'qtip2/basic/jquery.qtip',
             'sammy': 'sammy/lib/sammy',
             'sammy.haml': 'sammy/lib/plugins/sammy.haml',
             'sammy.title': 'sammy/lib/plugins/sammy.title',
             'haml': 'haml/lib/haml',
             'browser': 'jquery.browser/jquery.browser.min',
             'utils': '../../app/scripts/utils',
             'highlight': '../../app/lib/highlight.js/highlight.pack',
             'autosize': 'jquery-autosize/jquery.autosize.min',
             'nprogress': 'nprogress/nprogress',
             'noty': 'noty/js/noty/jquery.noty',
             'noty-layout': 'noty/js/noty/layouts/bottom',
             'noty-layout-left': 'noty/js/noty/layouts/bottomLeft',
             'noty-theme': 'noty/js/noty/themes/default',
             'qtip2': '../../app/lib/qtip/jquery.qtip.min',
             'imagesloaded': '../../app/lib/qtip/imagesloaded.min',
             'eventEmitter': 'eventEmitter/EventEmitter.min',
             'eventie': 'eventie/eventie',
             'canvas-loader': '/app/lib/heartcode-canvasloader-min'
         },
         shim: {
             dropkick: {
                 deps: ['jquery']
             },
             browser: {
                 deps: ['jquery']
             },
             'jquery.migrate': {
                 deps: ['jquery']
             },
             utils: {
                 deps: ['jquery']
             },
             autosize: {
                 deps: ['jquery']
             },
             'sammy.haml': {
                 deps: ['haml']
             },
             'sammy.title': {
                 deps: ['sammy']
             },
             nprogress: {
                 deps: ['jquery']
             },
             mixitup: {
                 deps: ['jquery']
             },
             'noty': {
                 deps: ['jquery']
             },
             'noty-layout': {
                 deps: ['noty']
             },
             'noty-layout-left': {
                 deps: ['noty-layout']
             },
             'noty-theme': {
                 deps: ['noty-layout']
             },
             'jqueryui': {
                 deps: ['jquery']
             },
             'qtip2': {
                 deps: ['jquery']
             },
         }

     });
     requirejs.onError = function (err) {
         if (err.requireType === 'timeout') {
             // tell user
             if (!$) {
                 alert('Error : load timeout. Please reload the page.');
             }
             else {
                 $('body').append('<div id="error"> <h3>Oooops ! Something went wrong</h3>' + '<b>Please reload the page</b><br />Could not load the script ' + err.requireModules + '<br />' + err.message + '</div>');
                 $("#error").dialog({
                     modal: true
                 });
             }
         }
         else {
             throw err;
         }
     };
     requirejs(['jquery', 'haml', 'nprogress', 'noty', 'noty-layout', 'noty-layout-left', 'noty-theme', 'highlight', 'qtip2', 'jqueryui'],

     function ($, haml, np, not, nl, nlf, nt, hlj, qtip, jui) {
         $.cart = [];
         window.haml = haml;
         NProgress.start();
         $('#login').qtip({
             content: '<h2>Log In</h2><form action="/login" method="post"><div><label>Username</label><input name="username" type="text"></div><div><label>Password</label><input name="password" type="password"></div><div><input value="Log In" type="submit"></div></form>',
             show: 'click',
             hide: 'unfocus',
             style: 'qtip-dark qtip-rounded',
             position: {
                 my: 'top center',
                 at: 'bottom center'
             }
         });
         requirejs(['utils', 'sammy', 'sammy.haml', 'browser', 'markdown', 'mixitup'], function (utils, sammy, shaml, browser, markdow, mixitup) {
             $.loader = '<li id="loader">' + '<div id="spin"><img src="/images/ajax-loader.gif" /></div>' + '<div id="text">Loading...</div>' + '</li>';
             var addCss = function (url) {
                 $('<link>').appendTo($('head')).attr({
                     type: 'text/css',
                     rel: 'stylesheet'
                 }).attr('href', url);
             };
             NProgress.inc();
             var app = sammy('#main', function () {
                 var self = this;
                 self.use(shaml);

                 self.get('/', function (context) {
                     NProgress.inc();
                     $.modskip = 0, $.modlimit = 10;
                     $.ajax({
                         type: "GET",
                         url: '/ajax/getmods/?sort=name&limit=' + $.modlimit + '&skip=' + $.modskip,
                         error: function (err) {
                             throw err;
                         },
                         success: function (mods) {
                             var grid = $('#Grid');
                             NProgress.inc();
                             var content = '';
                             $.each(mods, function (i) {
                                 var mod = mods[i];
                                 content += $.renderMod(mod);

                             });
                             context.swap(content, function () {
                                 console.log('[INFO]Mixing...');
                                 $('#Grid').mixitup($.getJSON('app/config/mixitup.json'));
                                 $('.cart').on('click', function () {
                                     var id = this.getAttribute('data-id');
                                     $.cart.push(id);

                                 });
                                 $.doLoad = true;
                                 $(window).scroll(function () {
                                     if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                                         if ($.doLoad === true) {
                                             $.doLoad = false;
                                             $('#main').append($.loader);
                                             $.modskip += 10;
                                             $.ajax({
                                                 type: "GET",
                                                 url: '/ajax/getmods/?sort=name&limit=' + $.modlimit + '&skip=' + $.modskip,
                                                 error: function (err) {
                                                     throw err;
                                                 },
                                                 success: function (mods) {
                                                     $('#main #loader').remove();
                                                     $.each(mods, function (i) {
                                                         var mod = mods[i];
                                                         $('#main').append($.renderMod(mod));

                                                     });

                                                 }
                                             });
                                             setTimeout(function () {
                                                 $.doLoad = true;
                                             }, 1500);
                                         }
                                     }
                                 });

                                 NProgress.done();

                             });
                         }
                     });


                 });

                 self.get('/view/:id', function () {
                     NProgress.start();
                     var id = this.params['id'];
                     var self = this;
                     $.ajax({
                         type: "GET",
                         url: "/ajax/info/?id=" + id,
                         error: function (err) {
                             throw err;
                         },
                         success: function (mod) {
                             var html = markdown.toHTML(mod.description);
                             NProgress.inc()
                             mod.htmldesc = html;
                             self.partial('/app/templates/mod.haml', mod, function () {
                                 NProgress.inc();
                                 addCss('/app/lib/highlight.js/styles/tomorrow-night-eighties.css');
                                 // addCss('/components/tabulous/demo/src/tabulous.css');
                                 $('pre code').each(function (i, e) {
                                     var code = hljs.highlightAuto($(this).html()).value;
                                     console.log(code);
                                     $(this).html(code);
                                 });
                                 $('#tabs').tabs();
                                 NProgress.done();

                             });


                         }
                     });

                 });

                 self.get('/edit/:id', function (context) {
                     NProgress.inc();
                     var self = this;
                     require([],

                     function () {
                         self.partial('/app/templates/edit.haml', undefined, function () {


                             NProgress.done();

                         });
                     });
                 });

                 self.get('/upload', function (context) {
                     console.log('Upload');
                     //self.setTitle('Upload a new mod - Open Cubes');
                     this.partial('app/templates/upload.haml', function () {

                         NProgress.inc();
                         $('#main').css({
                             'opacity': '0'
                         });
                         addCss('/components/jquery-dropkick2/dropkick.css');
                         $('#epiceditor').height(500);
                         requirejs(["EpicEditor", "markdown", "ladda", "autosize"], function (eeditor, markd, Ladda, as) {
                             NProgress.inc();
                             NProgress.inc();
                             var editor;
                             addCss('/components/Ladda/dist/ladda.min.css');

                             //$('.select').dropkick();
                             $('textarea').autosize();
                             $("#submit").unbind('click').on("click", function (event) {
                                 event.preventDefault();
                                 console.log('hi');
                                 var form = $('form').serializeObject();
                                 form.desc = editor.exportFile();
                                 // Create a new instance of ladda for the specified button
                                 var l = Ladda.create(document.querySelector('.ladda-button'));

                                 // Start loading
                                 l.start();

                                 $.ajax({
                                     url: '/ajax/addmod/',
                                     type: 'POST',
                                     data: {
                                         form: JSON.stringify(form)
                                     },
                                     dataType: 'json',
                                     success: function (data) {
                                         console.log(data)
                                         if (data.Status === 'Error') {
                                             switch (data.ErrorType) {
                                             case 'InvalidData':
                                                 $.each(data, function (i, v) {
                                                     var e = $('[name="' + v.property + '"]');
                                                     e.addClass('invalid');
                                                 });
                                                 $.scroll().scrollTop(1);
                                                 setTimeout(function () {
                                                     $.each(data, function (i, v) {
                                                         var e = $('[name="' + v.property + '"]');
                                                         e.removeClass('invalid');
                                                     });
                                                 }, 3000);
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
                                           //  context.redirect('view/' + data.DataId);
                                         }
                                         // Stop loading
                                         l.stop();

                                     },
                                     error: function (jqXHR, textStatus, err) {
                                         alert('text status ' + textStatus + ', err ' + err);
                                         // Stop loading
                                         l.stop();

                                     }
                                 });
                             }); // this will show the info it in firebug console
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
                                     defaultContent: '# This is a title\n\nThe description should be written in markdown. ' + '\nTo preview or switch to fullscreen mod, go at the end of the area (follow the arrow).\n**You should not put here changelog, downloads or features list. OpenKubes has a built-in manager for that.** \n\n##This is another title\n\n###...and subtitle\n\n' + '##  Code \n\n\nIndented with for spaces, it is a code\n\n     class HelloWorld {\n     public static void main(String[] args) {\n         System.out.println("Hello world!");\n     }' + '\n    }\n\n## Quotes\n\n\nYou can also do quoting by adding > at the beginning of the text\n' + '\n> Markdown is a lightweight markup language, originally created by John Gruber "allowing people ' + '\n to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)"' + '\nsMarkdown formatted text should be readable as-is, without looking like it\'s been marked up with tags or formatting instructions, ' + 'unlike text which has been formatted with a Markup language, such as HTML, which has obvious tags and formatting instructions.' + ' Markdown is a formatting syntax for text that can be read by humans and can be easily converted to HTML.\n\n_(Wikipedia)_' + '\n\n## Format\n\n\nThere are mutliple format possibilities : \n\n - A list is marked with a \'-\' at the beginning\n - An ordered list with 1. or 2.\n' + ' - You can make the text **bold** by putting \'**\' at the beginning and at the end of the text\n - _Italic_ is also possible with \'_\'',
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
                             });
                             editor.load(function () { //editor.preview();
                                 $('#main').animate({
                                     'opacity': '1'
                                 });

                                 NProgress.done();
                                 editor.reflow(function () {
                                     $.scroll().scrollTop(0);
                                 })
                             });
                         });


                     });
                 });



             });

             app.run();

         });

     });