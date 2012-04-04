wt.views.Feed = Backbone.View.extend({
    events: {
        'scroll': 'scroll'
    },

    bottomThreshold: 10,

    initialize: function() {
        this.messages = this.model.get('messages');

        this.messages.on('add', this.add, this);

        this.model.on('change:focus', this.checkUnreadMessages, this);

        $(window).on('resize', _.bind(this.resize, this));
        this.resize();
    },

    resize: function() {
        this.$el.css('max-height', $(window).height() - 80);
    },

    scroll: function() {
        var fromBottom = (this.$el.scrollTop() + this.$el.height()) - this.$el.prop('scrollHeight');
        this.model.set('atBottom', fromBottom + this.bottomThreshold >= 0);
        this.checkUnreadMessages();
    },

    scrollToBottom: function() {
        this.$el.scrollTop(this.$el.prop('scrollHeight'));
    },

    checkUnreadMessages: function() {
        if(this.model.get('focus')) {
            _.each(this.messages.where({ read: false }), this.checkUnreadMessage, this);
        }
    },

    checkUnreadMessage: function(message) {
        var $el = message.view.$el;
        var top = $el.position().top;
        var bottom = top + $el.outerHeight();

        if(bottom > 0 && top < this.$el.outerHeight()) {
            message.set({ read: true });
        }
    },

    add: function(message, collection) {
        var type = message.get('type');
        var viewClassName = type.charAt(0).toUpperCase() + type.slice(1) + 'Message';

        var view = new wt.views[viewClassName]({
            model: message
        });

        this.$el.append(view.render().el);
        message.view = view;

        this.model.get('atBottom') && this.scrollToBottom();

        this.checkUnreadMessages();
    }
});