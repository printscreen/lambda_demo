var assert = require('assert'),
	_ = require('lodash'),
	nodemock = require('nodemock'),
	model = require('../auth.js');

describe('Testing create toekn function', function () {
	it('Will successfully call all helper functions', function (done) {
		var auth = new model(),
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

		auth.getApiUser = mocked.getApiUser;
		auth.isValidApiKey = mocked.isValidApiKey;
		auth.generateKey = mocked.generateKey;

		auth.createToken({
			apiKey: 'test',
			secret: 'test',
			user: 'test'
		}, context);
	});
});