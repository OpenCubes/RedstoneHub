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
    '<div class="cart btn btn-primary" data-id="' + mod._id + '" data-icon="cartfill">Add to cart</div>' + '</div>' +
    '<div class="modinfo">' + '<a href="/view/' + mod._id + '" class="view" data-id="' + mod._id + '" >' +
    '<h1 class="title">' + mod.name + '</h1>' + '<h6 class="summary text">' + sum + '</h6>' + '</a>' +
    '<div class="links">' + '<a href="/demo/' + mod._id + '" id="demo demo_' + mod._id + '" data-id="' + mod._id + '" data-icon="play">demo</a> ' + '<a href="/view/' + mod._id + '" id="view view_' + mod._id + '" data-id="' + mod._id + '" data-icon="eye">view</a> ' + '<a href="/cmod/' + mod._id + '" id="cmod cmod_' + mod._id + '" data-id="' + mod._id + '" data-icon="cartfill">cart</a> ' + '<a onclick="star(\''+mod._id+'\')" href="/star/' + mod._id + '" id="star star_' + mod._id + '" data-id="' + mod._id + '" data-icon="stare">'+ (mod.vote_count ? mod.vote_count : 0)+'</a> ' + '</div>' + '</div>' + '</li>';
};
$.addMods = function(mods) {
    var content = '';
    $.each(mods, function(i) {
        var mod = mods[i];
        content += $.renderMod(mod);
    });
    return content;
}
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

}
star = function (id) {
    
}
