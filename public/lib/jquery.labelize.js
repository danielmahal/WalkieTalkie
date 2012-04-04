/* Labelizer jQuery plugin by Daniel Mahal (http://github.com/danielmahal) */

(function($) {
    $.fn.labelize = function(options) {
        var settings = {
            animate: true,
            fadeSpeed: 150,
            fadedOpacity: 0.35
        };

        $.extend(settings, options);

        var setOpacity = function(label, opacity, animate) {
            animate = animate && settings.animate;

            if(animate) {
                label.stop().fadeTo(settings.fadeSpeed, opacity);
            } else {
                label.css('opacity', opacity);
            }
        };

        return $(this).each(function() {
            var input = $(this);
            var label = $('label[for=' + input.attr('id') + ']');

            var check = function(e, animate) {
                animate = animate === false ? false : true;

                var hasValue = input.val().length > 0;
                var hasFocus = (e && e.type === 'focus') || input.is(':focus');

                if(hasValue) {
                    setOpacity(label, 0, animate);
                } else if(hasFocus) {
                    setOpacity(label, settings.fadedOpacity, animate);
                } else {
                    setOpacity(label, 1, animate);
                }
            };

            input.bind('focus blur keyup change', check);
            check(null, false);
        });
    };
})(jQuery);