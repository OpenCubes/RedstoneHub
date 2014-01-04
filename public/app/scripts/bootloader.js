requirejs.config({
    'catcheError': true,
    baseUrl: '../../components/',
    paths: {
        'jquery': '//code.jquery.com/jquery-1.9.1',
        'jqueryui': '//code.jquery.com/ui/1.10.3/jquery-ui',
        'history': 'history',
        'history.js': 'history',
        'sammy': 'sammy/lib/sammy',
        'sammy-haml': 'sammy/lib/plugins/sammy.haml',
        'sammy-title': 'sammy/lib/plugins/sammy.title',
        'haml': 'haml/lib/haml',
        'utils': '/app/scripts/utils',
        'cart': '/app/scripts/cart',
        'highlight': '../../app/lib/highlight.js/highlight.pack',
        'nprogress': 'nprogress/nprogress',
        'noty': 'noty/js/noty/jquery.noty',
        'noty-layout': 'noty/js/noty/layouts/bottom',
        'noty-layout-left': 'noty/js/noty/layouts/bottomLeft',
        'noty-theme': 'noty/js/noty/themes/default',
        'cookie': 'jquery.cookie/jquery.cookie',
        'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.0.1-p7/js/bootstrap.min',
        'user': '/app/scripts/user',
        'select': '/app/lib/select/bootstrap-select.min',
        'marked': '/app/lib/editor/marked',
        'bootbox': '/app/lib/bootbox.min',
        'main': '/app/scripts/main',
        'bootstrap-filestyle': '/app/lib/bootstrap-filestyle.min',
        'bootstrap-progress': '/app/lib/bootstrap-progressbar.min',
        'dynatree': '/app/lib/dynatree/jquery.dynatree.min',
        'socketio': '/socket.io/socket.io'
    },
    shim: {
        utils: ['jquery'],
        autosize: ['jquery'],
        'haml': {
            exports: 'window.haml'
        },
        'sammy': {
            exports: 'sammy'
        },
        'sammy-title': ['sammy'],
        'sammy-haml': ['sammy'],
        'nprogress': ['jquery'],
        'mixitup': ['jquery'],
        'noty': ['jquery'],
        'noty-layout': ['noty'],
        'noty-layout-left': ['noty-layout'],
        'noty-theme': ['noty-layout'],
        'cookie': ['jquery'],
        'bootstrap': ['jquery'],
        'select': ['jquery'],
        'bootbox': ['bootstrap'],
        'dynatree': ['jquery', 'jqueryui'],
        'main': {
            deps: ['haml', 'nprogress', 'noty', 'noty-layout',
                    'noty-layout-left', 'noty-theme', 'highlight',
                    'cookie', 'bootstrap', 'select', 'utils', 'bootbox']
        }
    }

});

requirejs.onError = function(err) {
        // tell user
        var bb = bootbox || {alert: alert}
        bb.alert('Error : see console for more infos. Please reload the page.');
        throw err;
       
};
var sammy, Sammy, marked;
// First load for global var
require(['jquery', 'sammy','sammy-haml', 'marked', 'dynatree'], function(jquery, sm, shaml, m, dt) {
    sm.Haml = shaml;
    Sammy = sammy = sm;
    marked = m;
    console.log(dt);
    require(['main'], function() {
        
    })
});