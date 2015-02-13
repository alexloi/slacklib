'use strict';
var _ = require('lodash');
var util = require('util');

var chai = require('chai');
chai.should();
// chai.use(require('chai-as-promised'));
var expect = chai.expect;

var chance = require('chance')();
var token = prcoess.env.SLACK;

var Slacklib = require('../');
var testChannel = 'C02DATU0D';

describe('Slacklib', function() {
    var lib = new Slacklib(token);

    before(function(done) {
        this.timeout('5000');

        lib.bot.on('open', function() {
            console.log('Openeed');
            done();
        });
    });

    describe('parse helpers', function () {

        it('should detect a URL', function(done){
            var url = chance.url();
            var testData = util.format('%s %s', chance.sentence(), chance.url());

            lib.on('processed', function(record){
                // str should equal url;
                record.url.should.equal.url;
                done();
            });

            lib.parse(testData);
        });

        it('should detect an image in a URL', function(done){
            var url = chance.url({ extensions: ['gif', 'jpg', 'png', 'jpeg']});
            lib._isImage(url).should.equal(true);
            done();
        });

        it('should detect a video', function(done){
            var url = chance.url({ domain: 'www.youtube.com'});
            lib._isVideo(url).should.equal(true);

            var falseUrl = chance.url({ domain: 'www.youtbe.com'});
            lib._isVideo(falseUrl).should.equal(false);
            done();
        });

        xit('should detect a code snippet', function(done) {

        });

        xit('should detect a custom prefix', function(done) {

        })
    });

});

