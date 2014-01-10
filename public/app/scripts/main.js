 $.cart = [];
 NProgress.start();
 // V=Avoid warnings in c9.io
 var noty = noty || undefined;
 var NProgress = NProgress || undefined;
 $.cart = [];
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
                 username: data.user.username
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

 $.loader = '<li id="loader">' + '<div id="spin"><img src="/images/ajax-loader.gif" /></div>' + '<div id="text">Loading...</div>' + '</li>';
 $('.filter').on('click', function(event) {

     var filter = $(this).attr('data-filter');
     var type = $(this).attr('data-filter-type');
     var url = $.app.getLocation();

     var newurl = $.makeURL(url, (type === 'category' ? filter : undefined), (type === 'order' ? filter : undefined));
     $.app.setLocation(newurl);
 });
 NProgress.inc();
 var app = sammy('#main', function() {
     var self = this;

     // Add sammy.haml
     self.use(Sammy.Haml);

     self.get(/\/browse(\/(.*))?/, function(context) {
         NProgress.inc();
         console.log('browsing...');
         // Position in db
         $.modskip = 0, $.modlimit = 10;
         $.scrollOffset = $.scrollOffset !== undefined ? $.scrollOffset : 0;

         // Parses sort (the path) into an order and a filter
         // /foo/bar ==> $.sort.category = foo // $.sort.order = bar
         var sort = this.params['splat'][0] || '';
         $.sort = {};
         // Matcher for parser : test if url has category AND sort order
         // Unparsed sort (/foo/bar)
         $.sort.unparsed = '';
         $.sort.previousLocation = $.sort.location;
         $.sort.location = $.app.getLocation();

         $.parseURL($.app.getLocation(), function() {
             $('.order-filter.active').removeClass('active');
             $('.category-filter.active').removeClass('active');
             $('.order-filter[data-filter=' + $.sort.order + ']').addClass('active');
             $('.category-filter[data-filter=' + $.sort.category + ']').addClass('active');
         });

         // Remember scroll distance from top
         $.scrollOffset = $.scrollOffset !== undefined ? $.scrollOffset : 0;

         // Avoid a loading before main load
         $.doLoad = false;
         if ($.mods === undefined || $.sort.location !== $.sort.previousLocation) $.mods = undefined;
         // Load mods from AJAX only if they were not loaded before
         // Thus, when the usrer select a mod and go back,
         // It does not load the mods again, but keep the previouses,
         // And go back where the user was in a second
         if ($.mods === undefined) {
             $.loadMods($.modskip, $.modlimit, $.sort.order, $.sort.category, true, function(mods) {
                 NProgress.inc();
                 var content = $.addMods(mods);
                 context.swap(content, function() {
                     //$('#Grid').mixitup($.getJSON('app/config/mixitup.json'));

                     // Create doLoad and more if undefined
                     $.more = $.more != undefined ? $.more : true;
                     $.doLoad = true;


                     // Trigger mods:loaded event
                     self.trigger('mods:loaded', {});

                     // It's done
                     NProgress.done();


                 });
             });
         }
         else {
             // load the previous mods
             var content = $.addMods($.mods);

             // Swapping mods
             context.swap(content, function() {
                 //$('#Grid').mixitup($.getJSON('app/config/mixitup.json'));

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
             if ($.regexBrowse.test($.app.getLocation())) {
                 // Write scrollTop
                 $.scrollOffset = $.scroll().scrollTop();
             }
             if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {

                 // Check wether they are more mods to be loaded AND the previous load has happened after a delay
                 if ($.doLoad === true && $.more === true && $.regexBrowse.test($.app.getLocation()) === true) {
                     // no new loads
                     $.doLoad = false;

                     // Append the ellipses
                     $('#main').append($.loader);

                     // Load only the 10 next mods
                     $.modskip += 10;

                     // AJAX Load
                     $.loadMods($.modskip, $.modlimit, $.sort.order, $.sort.category, function(mods) {


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


                     });
                     // Wait a delay before allowing next load
                     setTimeout(function() {
                         $.doLoad = true;
                     }, 1000);
                 }
             }
         });
     });

     self.get('/view/:slug', function() {

         NProgress.start();


         var slug = this.params['slug'];
         var self = this;
         $.ajax({
             type: "GET",
             url: "/ajax/info/?slug=" + slug,
             error: function(err) {
                 throw err;
             },
             success: function(mod) {
                 var html = marked(mod.description);
                 console.log(mod);
                 mod.canedit = $.user ? ($.user.logged ? ($.user.username === mod.author.username) : false) : false;
                 console.log(mod.canedit);
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
     self.get('/register', function(context) {
         require(['user', '/javascripts/motionCaptcha.js'], function(usr) {
             addCss('/stylesheets/motionCaptcha.css');
             register(context);
         });
     });
     self.get('/edit/:id', function(context) {
         NProgress.inc();
         var self = this;
         require(['user', 'bootstrap-filestyle', 'bootstrap-progress'], function(usr, btfs) {
             edit(self.params['id'], context);
         })
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
         $('#main').animate({'opacity': '0'});
         callback();
         $('#main').animate({'opacity': '1'});
     });

 });

 $.app = app;
 require(['cart'], function(cart) {
     $.cart.load();
 })
 app.run();
 