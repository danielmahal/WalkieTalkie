wt.views.Viewport = Backbone.View.extend({
    el: window,

    initialize: function(options) {
        this.pageTitle = options.pageTitle;

        this.model.on('change:unreadCount', this.updateTitle, this);

        $(window).on('focus', _.bind(this.activate, this));
        $(window).on('blur', _.bind(this.deactivate, this));
    },

    updateTitle: function(model, count) {
        document.title = (count > 0 ? '('+count+') ' : '') + this.pageTitle;
    },

    activate: function() {
        this.model.set('active', true);
    },

    deactivate: function() {
        this.model.set('active', false);
    }
});