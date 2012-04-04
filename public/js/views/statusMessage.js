wt.views.StatusMessage = wt.views.Message.extend({
    className: 'status message',
    template: _.template($('#status-message-template').remove().html())
});