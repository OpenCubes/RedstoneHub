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
            var li = $('<li data-name="' + mod.name + '" data-version="1.6#1.5.63" class="mix cheats mix_all"><h1>' + mod.name + '</h1><h4>Lum. Suspendisse nullam.</h4></li>').appendTo(grid);;
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
