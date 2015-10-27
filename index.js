var auth = require('./auth.js');

exports.handler = function (event, context) {
    var auth = new Auth();
    auth.createToken(event, context);
};