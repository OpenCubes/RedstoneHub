$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
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
$(document).ready(function () {
    var mods = $.ajax({
        type: "GET",
        url: "/ajax/getmods/?sort=name",
        error: function (err) {
            throw err;
        },
        success: function (mods) {
            var grid = $('#Grid');
            $.each(mods, function (i) {
                var mod = mods[i];
                var li = $('<li data-name="' + mod.name + '" data-version="1.6#1.5.63" class="mix cheats mix_all">' + '<img  class="mod_logo" src="' + (mod.logo ? mod.logo : '') + '" />' + '<h1>' + mod.name + '</h1><h6>' + mod.summary + '</h6></li>').appendTo(grid);;
            });
            $(function () {

                $('#Grid').mixitup({
                    targetSelector: '.mix',
                    filterSelector: '.filter',
                    sortSelector: '.sort',
                    buttonEvent: 'click',
                    effects: ['fade', 'scale', 'blur'],
                    listEffects: null,
                    easing: 'smooth',
                    layoutMode: 'list',
                    targetDisplayGrid: 'inline-block',
                    targetDisplayList: 'block',
                    gridClass: '',
                    transitionSpeed: 600,
                    showOnLoad: 'all',
                    sortOnLoad: false,
                    multiFilter: false,
                    filterLogic: 'or',
                    resizeContainer: true,
                    minHeight: 0,
                    failClass: 'fail',
                    perspectiveDistance: '3000',
                    perspectiveOrigin: '50% 50%',
                    animateGridList: true,
                    onMixLoad: null,
                    onMixStart: null,
                    onMixEnd: null
                });
                $("#loader").text("");
            });
        }
    });

    if (!mods) alert('error');

    $('.tooltip').attr('title', '<h2>Log In</h2><form action="/login" method="post"><div><label>Username</label><input name="username" type="text"></div><div><label>Password</label><input name="password" type="password"></div><div><input value="Log In" type="submit"></div></form>');

    $('.tooltip').tooltipster({
        interactive: true,
        trigger: 'click',
        functionReady: function (origin, tooltip) {
            $("form").on("submit", function (event) {
                event.preventDefault();
                var form = $('form').serializeObject()
                console.log(form)
                $.ajax({
                    url: '/login/',
                    type: 'POST',
                    data: JSON.stringify(form),
                    dataType: 'text',
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (jqXHR, textStatus, err) {
                        console.log('text status ' + textStatus + ', err ' + err);
                        if(err == 'Unauthorized'){
                            $('[type="password"]').val('');
                        }
                    }
                })

            })
        }
    });
});