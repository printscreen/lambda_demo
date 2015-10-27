var assert = require('assert'),
	_ = require('lodash'),
	nodemock = require('nodemock'),
	model = require('../index.js');

describe('Testing init function', function () {
	it('Will successfully call all helper functions', function (done) {
		var testObj = _.cloneDeep(model),
			mocked = {},
			context = {
				done: function (error, result) {
					mocked.assertThrows();
					done();
				}
			};

		mocked = nodemock.mock('getApiUser')
				.takes('test', function (){})
				.calls(1, ['', {}])
				.times(1);
		mocked.mock('isValidApiKey')
				.takes('test', {}, function() {})
				.calls(2, [])
				.times(1);
		mocked.mock('generateKey')
				.takes('test', function (){})
				.calls(1, ['', true])
				.times(1);

		testObj.handler.getApiUser = mocked.getApiUser;
		testObj.handler.isValidApiKey = mocked.isValidApiKey;
		testObj.handler.generateKey = mocked.generateKey;

		var test = new testObj.handler({
			apiKey: 'test',
			secret: 'test',
			user: 'test'
		}, context);
	});
});


/*

var Auth = function(event, context) {
    var self = this;
    this._dynamo = dynamodb;
    async.waterfall([
        self.getApiUser.bind(self, event.apiKey),
        self.isValidApiKey.bind(self, event.secret),
        self.generateKey.bind(self, event.user)
    ], function (error, result) {
        console.log(error, result);
        context.done(error, result);
    });
}
*/