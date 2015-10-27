var args = process.argv.slice(2),
	aws = require('aws-sdk'),
	fs = require('fs'),
	async = require('async');

aws.config.update({ accessKeyId: args[0], secretAccessKey: args[1] });

var lambda = new aws.Lambda();

fs.readFile('lambda.zip', function (err, data) {
  	if (err) {
  		throw err;
  	}

  	var params = {
		FunctionName: 'PitbossTest',
		Publish: true,
		ZipFile: data
	};
	lambda.updateFunctionCode(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
});