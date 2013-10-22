     requirejs.config({
         baseUrl: '../../components/',
         paths: {
             EpicEditor: 'EpicEditor/epiceditor/js/epiceditor.min',
             markdown: 'markdown/lib/markdown',
             ladda: 'Ladda/dist/ladda.min',
             dropkick: 'jquery-dropkick2/jquery.dropkick-1.0.0',
             Ladda: 'Ladda/dist/ladda.min',
             'jquery-autosize': 'jquery-autosize/jquery.autosize',
             mixitup: 'mixitup/jquery.mixitup.min',
             jquery: 'jquery/jquery',
             history: 'history',
             'history.js': 'history',
             spin: 'spin.js/dist/spin',
             'jquery.qtip': 'qtip2/basic/jquery.qtip',
             sammy: 'sammy/lib/sammy',
             'sammy.haml': 'sammy/lib/plugins/sammy.haml',
             'sammy.title': 'sammy/lib/plugins/sammy.title',
             haml: 'haml/lib/haml',
             browser: 'jquery.browser/jquery.browser.min',
             utils: '../../app/scripts/utils',
             autosize: 'jquery-autosize/jquery.autosize.min',
             nprogress: 'nprogress/nprogress'
         },
         shim: {
             dropkick: {
                 deps: ['jquery']
             },
             browser: {
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
             }
         }

     });
     requirejs(['jquery', 'haml', 'nprogress'], function($, haml, np) {
         
         window.haml = haml;
         NProgress.start();
         requirejs(['utils', 'sammy', 'sammy.haml', 'browser', 'markdown'], function(utils, sammy, shaml, browser, markdow) {
             var addCss = function(url) {
                 $('<link>').appendTo($('head')).attr({
                     type: 'text/css',
                     rel: 'stylesheet'
                 }).attr('href', url);
             };
             NProgress.inc();
             var app = sammy('#main', function() {
                 var self = this;
                 self.use(shaml);



                 self.get('/upload', function(context) {

                     //self.setTitle('Upload a new mod - Open Cubes');
                     this.partial('app/templates/upload.haml', function() {

                         NProgress.inc();
                         $('form').css({
                             'opacity': '0'
                         });
                         addCss('/components/jquery-dropkick2/dropkick.css');
                         $('#epiceditor').height(500);
                         requirejs(["EpicEditor", "markdown", "ladda", "dropkick", "autosize"], function(eeditor, markd, Ladda, dk, as) {
                             NProgress.inc();
                             NProgress.inc();
                             var editor;
                             addCss('/components/Ladda/dist/ladda.min.css');

                             $('.select').dropkick();
                             $('textarea').autosize();
                             $("#submit").unbind('click').on("click", function(event) {
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

                                     },
                                     error: function(jqXHR, textStatus, err) {
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
                             editor.load(function() { //editor.preview();
                                 $('form').css({
                                     'opacity': '1'
                                 });

                                 NProgress.done();
                                 editor.reflow(function () {
                                     $().getScroll().scrollTop(0);
                                 })
                             });
                         });


                     });
                 });


             });
             app.run();

         });
     });