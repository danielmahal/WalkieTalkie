wt.views.header = Backbone.View.extend({
    statusTemplate: _.template($('#header-status-template').remove().html()),

    initialize: function() {
        this.$status = this.$('.status');

        this.model.on('change:area', this.render, this);
        this.render();
    },

    render: function() {
        this.$el.toggleClass('connected', this.model.get('connected'));
        this.$status.html(this.statusTemplate(this.model.toJSON()));
    }
});