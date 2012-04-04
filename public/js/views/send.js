wt.views.Send = Backbone.View.extend({
    events: {
        'submit': 'submit'
    },

    initialize: function(options) {
        this.socket = options.socket;
        this.feed = options.feed;

        this.$input = this.$('input');
        this.$input.labelize();
    },

    submit: function(e) {
        e.preventDefault();
        var value = this.$input.val();
        if(!value) return;

        this.socket.emit('msg', {
            type: 'text',
            text: value
        });

        this.$input.val('');

        this.feed.scrollToBottom();
    }
});