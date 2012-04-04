wt.models.App = Backbone.Model.extend({
    defaults: {
        connected: false,
        area: null,
        latitude: null,
        longitude: null,
        messages: null,
        unreadCount: 0,
        focus: true,
        watchID: null,
        atBottom: true
    },

    initialize: function(options) {
        this.socket = options.socket;
        this.socket.on('connect', _.bind(this.connected, this));
        this.socket.on('disconnect', _.bind(this.disconnected, this));
        this.socket.on('area', _.bind(this.areaUpdate, this));
        this.socket.on('msg', _.bind(this. messageUpdate, this));

        this.set('messages', new wt.collections.Messages());
        this.messages = this.get('messages');

        this.messages.on('add', this.messageAdded, this);

        this.on('change:position', this.sendPosition, this);
        this.on('change:area', this.areaChange, this);

        $(window).on('focus', _.bind(this.focus, this));
        $(window).on('blur', _.bind(this.blur, this));
    },

    connected: function() {
        this.set('connected', true);
        !!this.get('position') && this.sendPosition();
    },

    disconnected: function() {
        this.set({
            connected: false,
            area: null
        });
    },

    areaUpdate: function(area) {
        this.set('area', area);
    },

    areaChange: function(model, area) {
        this.messages.add({
            type: 'status',
            text: 'You are now tuned into <em>'+area+'</em>'
        });
    },

    messageUpdate: function(data) {
        this.messages.add(data);
    },

    watchPosition: function() {
        if(!this.get('watchID')) {
            this.set('watchID', navigator.geolocation.watchPosition(_.bind(this.positionUpdate, this)));
        }
    },

    sendPosition: function() {
        console.log('Sending new position');
        this.socket.emit('position', this.get('position'));
    },

    positionUpdate: function(position) {
        this.set('position', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        });
    },

    messageAdded: function(message, collection) {
        message.on('change:read', this.countUnread, this);
        this.countUnread();
    },

    countUnread: function() {
        this.set({
            unreadCount: this.messages.where({ read: false }).length
        });
    },

    focus: function() {
        this.set('focus', true);
    },

    blur: function() {
        this.set('focus', false);
    }
});