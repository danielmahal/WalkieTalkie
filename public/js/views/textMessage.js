wt.views.TextMessage = wt.views.Message.extend({
    className: 'text message',
    template: _.template($('#text-message-template').remove().html())
});