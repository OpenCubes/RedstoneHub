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
             'browser': 'jquery.browser/dist/jquery.browser.min',
             'utils': '/app/scripts/utils',
             'cart': '/app/scripts/cart',
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
             'canvas-loader': '/app/lib/heartcode-canvasloader-min',
             'cookie': 'jquery.cookie/jquery.cookie',
             'socketio': '//minecrafthub-c9-vinz243.c9.io/socket.io/socket.io',
             'vset': '/app/lib/jquery.vset',
             'bootstrap': 'bootstrap/dist/js/bootstrap.min',
             'user': '/app/scripts/user',
             'select': '/app/lib/select/bootstrap-select.min'
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
             'cookie': {
                 deps: ['jquery']
             },
             'socketio': {
                 exports: 'io',
                 wrap: false
             },
             'vset': {
                 deps: ['jquery']
             },
             'bootstrap': {
                 deps: ['jquery']
             },
             'select': {
                 deps: ['jquery']
             }
         }

     });
     requirejs.onError = function(err) {
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
     requirejs(['jquery', 'haml', 'nprogress', 'noty', 'noty-layout', 'noty-layout-left', 'noty-theme', 'highlight', 'cookie', 'bootstrap', 'select'],

     function($, haml, np, not, nl, nlf, nt, hlj,  cake, bs) {
         $.cart = [];
         window.haml = haml;
         NProgress.start();
         $('#login').popover({
             html: true,
             content: '<form action="/login" method="post" role="form" id="login-form"><div class="input-group"><span class="input-group-addon" data-icon="u"></span><input type="text" class="form-control" placeholder="Username" name="username"></div><div class="input-group"><span class="input-group-addon" data-icon="l"></span><input type="password" class="form-control" placeholder="Password" name="password"></div><button type="submit" id="do-login" class="btn btn-default" onclick="return false">Submit</button></form>',
             placement: 'bottom',
             title: 'Login'
         });
         
         $.ajax({
             url: '/isauth',
             type: 'GET',
             dataType: 'json',
             success: function(data) {
                 if (data.user) {
                     noty({
                         text: 'Welcome back, ' + data.user.username,
                         type: 'success',
                         layout: 'bottomLeft'
                     });
                     $.user = {
                         logged: true,
                         username: data.username
                     };
                 }
             },
             error: function(jqXHR, textStatus, err) {
                console.log(err);
             }
         });
         
         $('#login').on('shown.bs.popover', function() {

             $("#do-login").on("click", function(event) {
                 event.preventDefault();
                 var form = $('#login-form').serializeObject();

                 $.ajax({
                     url: '/login',
                     type: 'POST',
                     data: {
                         username: form.username,
                         password: form.password
                     },
                     dataType: 'json',
                     success: function(data) {
                         noty({
                             text: 'Successfully logged in.',
                             type: 'success',
                             layout: 'bottomLeft'
                         });
                         $('#user').html('<a data-icon="u">Welcome ' + data.user.username + '</a><a id="logout" href="/logout">Logout</a>');
                         $.user = {
                             logged: true,
                             username: data.username
                         };
                     },
                     error: function(jqXHR, textStatus, err) {
                         noty({
                             text: 'Invalid username and password, please retry',
                             type: 'error',
                             layout: 'bottomLeft'
                         })

                     }
                 });
             });
         });

         requirejs(['utils', 'sammy', 'sammy.haml', 'browser', 'markdown', 'mixitup'], function(utils, sammy, shaml, browser, markdow, mixitup) {
             $.loader = '<li id="loader">' + '<div id="spin"><img src="/images/ajax-loader.gif" /></div>' + '<div id="text">Loading...</div>' + '</li>';
             
             NProgress.inc();
             var app = sammy('#main', function() {
                 var self = this;

                 // Add sammy.haml
                 self.use(shaml);

                 self.get('/', function(context) {
                     NProgress.inc();

                     // Position in db
                     $.modskip = 0, $.modlimit = 10;

                     // Remember scroll distance from top
                     $.scrollOffset = $.scrollOffset !== undefined ? $.scrollOffset : 0;

                     // Avoid a loading before main load
                     $.doLoad = false;

                     // Load mods from AJAX only if they were not loaded before
                     // Thus, when the usrer select a mod and go back,
                     // It does not load the mods again, but keep the previous,
                     // And go back where the user was in a second
                     if ($.mods === undefined) {
                         $.ajax({
                             type: "GET",
                             url: '/ajax/getmods/?sort=name&limit=' + $.modlimit + '&skip=' + $.modskip,
                             error: function(err) {
                                 throw err;
                             },
                             success: function(mods) {

                                 // Create the mods if they do not exists
                                 $.mods = $.mods !== undefined ? $.mods : mods;

                                 NProgress.inc();
                                 var content = $.addMods(mods);
                                 context.swap(content, function() {
                                     $('#Grid').mixitup($.getJSON('app/config/mixitup.json'));

                                     // Create doLoad and more if undefined
                                     $.more = $.more != undefined ? $.more : true;
                                     $.doLoad = true;


                                     // Trigger mods:loaded event
                                     self.trigger('mods:loaded', {});

                                     // It's done
                                     NProgress.done();

                                 });
                             }
                         });
                     }
                     else {
                         // load the previous mods
                         var content = $.addMods($.mods);

                         // Swapping mods
                         context.swap(content, function() {
                             $('#Grid').mixitup($.getJSON('app/config/mixitup.json'));

                             // Create doLoad and more if undefined
                             $.doLoad = true;
                             $.more = $.more != undefined ? $.more : true;

                             self.trigger('mods:loaded', {});
                             self.trigger('load:done', {});

                             // It's done
                             NProgress.done();

                             // Scroll
                             $.scroll().scrollTop($.scrollOffset);
                         });

                     }; // Load more when reached bottom
                     $(window).scroll(function() {
                         if ($.app.getLocation() === '/') {
                             // Write scrollTop
                             $.scrollOffset = $.scroll().scrollTop();
                         }
                         if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {

                             // Check wether they are more mods to be loaded AND the previous load has happened after a delay
                             if ($.doLoad === true && $.more === true && $.app.getLocation() === '/') {
                                 // no new loads
                                 $.doLoad = false;

                                 // Append the ellipses
                                 $('#main').append($.loader);

                                 // Load only the 10 next mods
                                 $.modskip += 10;

                                 // AJAX Load
                                 $.ajax({
                                     type: "GET",
                                     url: '/ajax/getmods/?sort=name&limit=' + $.modlimit + '&skip=' + $.modskip,
                                     error: function(err) {
                                         throw err;
                                     },
                                     success: function(mods) {

                                         // Remove all the loader
                                         $('#main #loader').remove();

                                         // Is there any mod ?
                                         if (mods.length > 0) {

                                             //If so load the mods
                                             $('#main').append($.addMods(mods));
                                             $.mods = $.mods.concat(mods);
                                             self.trigger('mods:loaded', {});
                                             self.trigger('load:done', {});


                                         }
                                         else {

                                             // Otherwise stop loading defintly
                                             console.log('No more mods');
                                             $.more = false;
                                         }

                                     }
                                 });
                                 // Wait a delay before allow next load
                                 setTimeout(function() {
                                     $.doLoad = true;
                                 }, 1000);
                             }
                         }
                     });
                 });

                 self.get('/view/:id', function() {

                     NProgress.start();


                     var id = this.params['id'];
                     var self = this;
                     $.ajax({
                         type: "GET",
                         url: "/ajax/info/?id=" + id,
                         error: function(err) {
                             throw err;
                         },
                         success: function(mod) {
                             var html = markdown.toHTML(mod.description);
                             NProgress.inc()
                             mod.htmldesc = html;
                             self.partial('/app/templates/mod.haml', mod, function() {
                                 NProgress.inc();
                                 addCss('/app/lib/highlight.js/styles/github.css');
                                 // addCss('/components/tabulous/demo/src/tabulous.css');
                                 $('pre code').each(function(i, e) {
                                     var code = hljs.highlightAuto($(this).html()).value;
                                     console.log(code);
                                     $(this).html(code);
                                 });
                                 $('#tabs a').click(function(e) {
                                     e.preventDefault()
                                     $(this).tab('show')
                                 })
                                 
                                 NProgress.done();
                                 self.trigger('load:done', {});




                             });
                         }


                     });
                 });


                 self.get('/edit/:id', function(context) {
                     NProgress.inc();

                 });

                 self.get('/upload', function(context) {
                     require(['user'], function(usr) {
                         upload(context);
                     });
                 });

                 self.bind('mods:loaded', function(event, data) {
                     $('.cart').unbind('click').bind('click', function(event) {
                         $.cart.put(this.getAttribute('data-id'));
                     });
                     $(".screen").fadeOut(500);
                 });

                 self.bind('load:done', function(event, data) {
                     $(".screen").fadeOut(500);
                 });

                 self.bind('cart', function(event, data) {

                     switch (data.verb) {

                     case 'PUT':
                         var token = Date.now();
                         var content = '<li class="item ' + token + '" data-id="' + data.mod_id + '..." ><h4>Adding mod...' + '</h5><div>Please wait...</div></li>'
                         $('ul#cartitems').append(content);
                         $('.emptycart').remove();
                         $('#cartcount').html($.cart.items.length);
                         $.ajax({
                             type: "GET",
                             url: "/ajax/info/?id=" + data.mod_id,
                             success: function(mod) {
                                 var content = '<li class="item" data-id="' + data.mod_id + '" >' + '<div class="cartiteminfo">' + '<h4>' + mod.name + '</h4>' + '<div class="sum">' + mod.summary + '</div>' + '</div>' + '<a href="#" data-icon="info" class=".infomod" data-id="' + data.mod_id + '"></a>' + '<a href="#" data-icon="warning" class=".warningmod" data-id="' + data.mod_id + '"></a>' + '<a href="#" data-icon="trash" class=".removemod" data-id="' + data.mod_id + '" onclick="$.cart.remove(\'' + data.mod_id + '\');"></a>' + '</li>';
                                 $('ul#cartitems').append(content);
                                 $('.' + token).remove();

                             }
                         });

                         break;

                     case 'DEL':
                         $('li.item[data-id=' + data.mod_id + ']').remove();
                         break;

                     case 'DOWNLOAD':
                         break;

                     case 'CLEAR':
                         break;

                     }
                 });
                 // Scroll to top on each route
                 self.around(function(callback) {
                     $.scroll().scrollTop(0);
                     callback();
                 });

             });

             $.app = app;
             require(['cart'], function(cart) {
                 $.cart.load();
             })
             app.run();

         });
     });