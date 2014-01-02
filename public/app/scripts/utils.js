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

$.scroll = function() {
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
};

$.renderMod = function(mod) {
    var sum = mod.summary;
    var l = mod.summary.length;
    if (l > 160) {

        sum = sum.substring(0, 150);
        sum = sum.trim() + '...' + sum.substr(l - 10, 9);
    }
    return '<li data-name="' + mod.name + '" data-version="1.6#1.5.63" class="mix ' + mod.category_id + ' mix_all">' +
    '<img  class="mod_logo" src="' + (mod.logo ? mod.logo : 'http://icons.iconarchive.com/icons/icojam/blue-bits/128/module-puzzle-icon.png') + '" />' +
    '<div class="actions btn-group-vertical">' + '<div class="download btn btn-primary" data-icon="download">Download now</div>' +
    '<div class="cart btn btn-primary" data-id="' + mod.slug + '" data-icon="cartfill">Add to cart</div>' + '</div>' +
    '<div class="modinfo">' + '<a href="/view/' + mod.slug + '" class="view" data-id="' + mod.slug + '" >' +
    '<h1 class="title">' + mod.name + '</h1>' + '<h6 class="summary text">' + sum + '</h6>' + '</a>' +
    '<div class="links">' + '<a href="/demo/' + mod.slug + '" id="demo demo_' + mod.slug + '" data-id="' + mod.slug + '" data-icon="play">demo</a> ' +
    '<a href="/view/' + mod.slug + '" id="view view_' + mod.slug + '" data-id="' + mod.slug + '" data-icon="eye">view</a> ' +
    '<a href="/cmod/' + mod.slug + '" id="cmod cmod_' + mod.slug + '" data-id="' + mod.slug + '" data-icon="cartfill">cart</a> ' +
    '<a href="/cmod/' + mod.slug + '" id="cmod cmod_' + mod.slug + '" data-id="' + mod.slug + '" data-icon="cartfill">cart</a> ' +
    '<a onclick="star(\''+mod.slug+'\')" href="#" id="star star_' + mod.slug + '" data-id="' + mod.slug + '" data-icon="stare">'+ (mod.vote_count ? mod.vote_count : 0)+'</a> ' + '</div>' + '</div>' + '</li>';
};

$.addMods = function(mods) {
    var content = '';
    $.each(mods, function(i) {
        var mod = mods[i];
        content += $.renderMod(mod);
    });
    return content;
};

addCss = function(url) {
    $('<link>').appendTo($('head')).attr({
        type: 'text/css',
        rel: 'stylesheet'
    }).attr('href', url);
};

$.addCss = addCss;

logout = function(event) {
    event.preventDefault();

    $.ajax({
        url: '/logout',
        type: 'GET',
        dataType: 'text',
        success: function(data) {
            noty({
                text: 'Successfully logged out..',
                type: 'success',
                layout: 'bottomLeft'
            });
            $('#user').html('<a href="/register" data-icon="user">Register</a><a id="login" href="/login" onclick="return false">Login</a>');
        },
        error: function(jqXHR, textStatus, err) {
            noty({
                text: 'Error: ' + textStatus,
                type: 'error',
                layout: 'bottomLeft'
            })

        }
    });

};

var star = function (id) {
    alert(id);
};
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

$.makeURL = function(url, category, order) {

    // foo/bar ==> [foo, bar]
    var segments = url.split('/');
    segments.clean('');
    console.log(segments);
    
    var newurl, newcat, neworder;
    switch(segments.length){
        case 0:
            // Then url is /
            newcat = category || 'all';
            neworder = order || '';
            break;
        case 1:
            // Then url is browse/
            newcat = category || 'all';
            neworder = order || '';
            break;
        case 2:
            // Then url is bowse/catgeory
            newcat = category || segments[1];
            neworder = order || '';
            break;
        case 3:
            // then url is browse/category/order
            // Then url is bowse/catgeory
            newcat = category || segments[1];
            neworder = order || segments[2];
            break;
        default:
            console.log('WTF?');
    }
    newurl = '/browse/'+newcat+'/'+neworder;
    console.log(newurl);
    return newurl;
};

$.regexBrowse = new RegExp("^(/browse)(/\\w{1,})(/(\\-{0,1})\\w{1,}/{0,1})$", "gi");

$.parseURL = function(url, callback) {
    // foo/bar ==> [foo, bar]
    var segments = url.split('/');
    // Removes ''
    segments.clean('');
    
    var newcat, neworder;
    switch(segments.length){
        case 0:
            // Then url is /
            newcat = 'all';
            neworder = 'creation_date';
            break;
        case 1:
            // Then url is browse/
            newcat = 'all';
            neworder = 'creation_date';
            break;
        case 2:
            // Then url is bowse/catgeory
            newcat = segments[1];
            neworder = 'creation_date';
            break;
        case 3:
            // then url is browse/category/order
            newcat = segments[1];
            neworder = segments[2];
            break;
        default:
            console.log('WTF?');
    }
    $.sort.order = neworder;
    $.sort.category = newcat;
    if(callback)callback();
    return;
};
// skip, limit, sort [, category, notify], callback
$.loadMods = function(skip, limit, sort, category, notify, callback) {
    // skip, limit, sort, category, callback
    if (typeof notify === "function") {
        callback = notify;
        notify = false;
    }
    // skip, limit, sort, callback
    if (typeof category === "function") {
        callback = category;
        notify = false;
        category = 'all';
    }
    $.ajax({
        type: "GET",
        url: '/ajax/getmods/?sort=' + (sort || 'creation_date') + '&limit=' + limit + '&skip=' + skip + '&category='+category,
        error: function(err) {
            throw err;
        },
        success: function(mods) {
            // Create the mods if they do not exists
            $.mods = $.mods !== undefined ? $.mods : mods;

            if (callback) 
                callback(mods);
            

        }
    });
};