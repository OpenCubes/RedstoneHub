/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'iconset1\'">' + entity + '</span>' + html;
        el.innerHTML = '<input type="text" readonly="readonly" value="'+entity.toString()+'" />' + html;
	}
	var icons = {
			'icon-star1' : '&#x53;',
			'icon-upload' : '&#x5e;',
			'icon-user' : '&#x75;',
			'icon-quotes' : '&#x22;',
			'icon-keyboard' : '&#x6b;',
			'icon-help' : '&#x3f;',
			'icon-reload' : '&#xb0;',
			'icon-warning' : '&#x21;',
			'icon-star2' : '&#x73;',
			'icon-info' : '&#x69;',
			'icon-menu4' : '&#x7e;',
			'icon-error' : '&#x45;',
			'icon-quit' : '&#x71;',
			'icon-settings' : '&#x50;',
			'icon-rss' : '&#x72;',
			'icon-downloadpg' : '&#x44;',
			'icon-uploadpg' : '&#x55;',
			'icon-earth' : '&#x65;',
			'icon-history' : '&#x52;',
			'icon-forum' : '&#x66;',
			'icon-compass' : '&#x4e;',
			'icon-share' : '&#x67;',
			'icon-book' : '&#x62;',
			'icon-back' : '&#x70;',
			'icon-home' : '&#x68;',
			'icon-cart2' : '&#x43;',
			'icon-cart' : '&#x63;',
			'icon-menu2' : '&#x2e;',
			'icon-menu1' : '&#x2d;',
			'icon-menu3' : '&#x5f;',
			'icon-grid' : '&#x3a;',
			'icon-expand' : '&#x3e;',
			'icon-contract' : '&#x3c;',
			'icon-spinner' : '&#x2a;',
			'icon-download' : '&#x64;',
			'icon-double-angle-up' : '&#x32;',
			'icon-double-angle-down' : '&#x38;',
			'icon-angle-left' : '&#x34;',
			'icon-angle-right' : '&#x36;',
			'icon-angle-up' : '&#x39;',
			'icon-angle-down' : '&#x33;',
			'icon-desktop' : '&#x2f;',
			'icon-quote-left' : '&#x5b;',
			'icon-quote-right' : '&#x5d;',
			'icon-sort-by-alphabet' : '&#x28;',
			'icon-sort-by-alphabet-alt' : '&#x29;',
			'icon-youtube' : '&#x79;',
			'icon-facebook' : '&#x46;',
			'icon-twitter' : '&#x74;',
			'icon-vimeo2' : '&#x76;',
			'icon-deviantart' : '&#x61;',
			'icon-github' : '&#x47;',
			'icon-blogger' : '&#x42;',
			'icon-tumblr' : '&#x54;',
			'icon-paypal' : '&#x24;',
			'icon-arrow-down-alt1' : '&#x26;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};