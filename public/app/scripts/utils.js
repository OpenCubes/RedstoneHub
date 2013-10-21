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