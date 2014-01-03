requirejs.config({
    'catcheError': true,
    baseUrl: '../../components/',
    paths: {
        'jquery': '//code.jquery.com/jquery-1.9.1',
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
        'bootstrap': 'bootstrap/dist/js/bootstrap.min',
        'user': '/app/scripts/user',
        'select': '/app/lib/select/bootstrap-select.min',
        'marked': '/app/lib/editor/marked',
        'main': '/app/scripts/main'
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
        'main': {
            deps: ['haml', 'nprogress', 'noty', 'noty-layout',
                    'noty-layout-left', 'noty-theme', 'highlight',
                    'cookie', 'bootstrap', 'select', 'utils']
        }
    }

});

requirejs.onError = function(err) {
    if (err.requireType === 'timeout') {
        // tell user
        
            alert('Error : load timeout. Please reload the page.');
        throw err;
       
    }
    else {
        throw err;
    }
};
var sammy, Sammy, marked;
// First load for global var
require(['jquery', 'sammy','sammy-haml', 'marked'], function(jquery, sm, shaml, m) {
    sm.Haml = shaml;
    Sammy = sammy = sm;
    marked = m;
    require(['main'], function() {
        
    })
});