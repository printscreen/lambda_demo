var args = process.argv.slice(2),
	aws = require('aws-sdk'),
	fs = require('fs'),
	async = require('async');

aws.config.update({ accessKeyId: args[0], secretAccessKey: args[1] });

var s3 = new aws.S3({
	region: 'us-east-1'
});

fs.readFile('lambda.zip', function (err, data) {
  	if (err) {
  		throw err;
  	}

  	s3.putObject({
		Bucket: 'pitboss-lambda-prototype',
		Body: data,
		Key: 'lambda.zip',
		ContentType: 'application/zip',
		ACL: 'public-read'
	}, function (error, result) {
		console.log(error, result);
	});
});