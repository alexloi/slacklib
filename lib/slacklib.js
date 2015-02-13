'use strict';

var Slack = require('slackbotAPI');
var util = require('util');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var URI = require('URIjs')

var Slacklib = function (token) {
    var self = this;
    var bot = new Slack(token);

    EventEmitter.call(this);

    this.bot = bot;

    this.bot.on('open', function() {
        bot.on('message', self.listen);
    });
};

util.inherits(Slacklib, EventEmitter);

Slacklib.prototype.listen = function(message) {
    this.parse(message);
};

Slacklib.prototype.parse = function(message) {
    var self = this;
    var urls = [];

    URI.withinString(message, function(url){
        var type = 'url';

        // Check if video
        if(self._isVideo(url)) type = 'image';
        // Check if image
        if (self._isImage(url)) type = 'video';

        // Emit (default type is URL)
        return self.emit('processed', { message: message, parsedType: type, parsedUrl: url });
    });
};

Slacklib.prototype._isImage = function(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
};

Slacklib.prototype._isVideo = function(url) {
    return url.match(/(youtube|vimeo|dailymotion)/g) !== null;
};

module.exports = Slacklib;