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
        bot.on('message', self.parse);
    });

    this._isImage = function(url) {
        return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
    };
    this._isVideo = function(url) {
        return url.match(/(youtube|vimeo|dailymotion)/g) !== null;
    };

    this.parse = function(message) {
        var urls = [];
        var text = message.text;

        URI.withinString(text, function(url){
            var type = 'url';

            // Check if video
            if (self._isVideo(url)) type = 'video';
            // Check if image
            if (self._isImage(url)) type = 'image';

            // Emit (default type is URL)
            return self.emit('processed', { message: message, parsedType: type, parsedResult: url });
        });
    };
};

util.inherits(Slacklib, EventEmitter);

module.exports = Slacklib;