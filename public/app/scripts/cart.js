$.cart = {
    items: []
};

// Add a mod to the cart according its id
$.cart.put = function(id) {
    if ($.cart.items.indexOf(id) === -1) {
        // Push the id to the cart
        $.cart.items.push(id);

        // Trigger
        $.app.trigger('cart', {
            verb: 'PUT',
            mod_id: id
        });
    }
};

// Remove a mod from the cart
$.cart.remove = function(id) {
    var index = $.cart.items.indexOf(id);
    if (index !== -1) {
        // Push the id to the cart

        $.cart.items.splice(index, 1);


        // Trigger
        $.app.trigger('cart', {
            verb: 'DEL',
            mod_id: id
        });
    }
};

// Store the mod in a cookie
$.cart.store = function(cookiename) {

    // cookieename is optionnal
    cookiename = cookiename ? cookiename : 'oc_cart';

    // Put the cookie
    $.cookie(cookiename, JSON.stringify($.cart));

    // Trigger the store event
    $.app.trigger('cart', {
        verb: 'STORE'
    })
};

// Load the cart from a cookie
$.cart.load = function(cookiename) {

    // cookieename is optionnal
    cookiename = cookiename ? cookiename : 'oc_cart';

    // Put the cookie
    var cookie = $.cookie(cookiename);

    // Only if cookie exists
    if (cookie) {
        // parse the cookie
        var cart = JSON.parse(cookie);

        // For each item, put it into the $.cart
        $.each(cart.items, function(i) {
            $.cart.put(cart.items[i]);
        });

        // Trigger the store event
        $.app.trigger('cart', {
            verb: 'LOAD'
        })
    }

};

// Store each time the cart is modified
$.app.bind('cart', function(e, d) {
    if (d.verb !== 'STORE') $.cart.store();
});


// Debug
$.app.bind('cart', function(e, data) {
    console.log(data.verb + ' ; ' + $.cart);
});