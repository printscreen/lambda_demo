var jwt = require('jsonwebtoken'),
    fs = require('fs'),
    SECRET = 'Why_not_Zoidberg???';
    aws = require('aws-sdk'),
    async = require('async'),
    dynamodb = new aws.DynamoDB({
        region: 'us-east-1'
    });

var Auth = function () {};

Auth.prototype.createToken = function(event, context) {
    var self = this;
    this._dynamo = dynamodb;

    async.waterfall([
        self.getApiUser.bind(self, event.apiKey),
        self.isValidApiKey.bind(self, event.secret),
        self.generateKey.bind(self, event.user)
    ], function (error, result) {
        context.done(error, result);
    });
}

Auth.prototype.getApiUser = function (apiKey, callback) {
    this._dynamo.getItem({
        TableName: 'pitboss_api_key_prototype',
        Key: {
            api_key : {
                S: apiKey
            }
        }
    }, function(err, data) {
        var apiUser = {};
        if (err) {
            return setImmediate(callback, err);
        }
        console.log('Result from dynamo: ' + data);
        if (data.Item) {
            console.log(data.Item);
            apiUser.apiKey = data.Item.api_key.S;
            apiUser.secret = data.Item.secret.S;
        }
        callback(null, apiUser);
    });
}

Auth.prototype.isValidApiKey = function (secret, apiUser, callback) {
    var isValid = false;
    console.log(apiUser);
    if (apiUser && apiUser.secret === secret) {
        isValid = true;
    }

    if (!isValid) {
        return setImmediate(callback, new Error('Invalid Credentials'));
    }
    callback();
}

Auth.prototype.generateKey = function (user, callback) {
    var token = jwt.sign(user, SECRET, {expiresIn: '2 days'});
    return callback (null, {
        token: token
    });
}

module.exports = Auth;