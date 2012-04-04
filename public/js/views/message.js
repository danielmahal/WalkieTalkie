wt.views.Message = Backbone.View.extend({
    tagName: 'div',
    className: 'message',

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});