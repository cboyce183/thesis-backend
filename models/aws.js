// const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
require('dotenv').config()

sendToAWS = async (profilePicBase64, filename) => {
  ////// file names and id
  // var fileName = Object.keys(ctx.request.body.fields)[0];
  var albumPhotosKey = 'zendama/';
  var photoKey = albumPhotosKey + filename;

  ///////// amazon webservices
  const albumBucketName = process.env.AWS_FOLDER;
  const bucketRegion =  process.env.AWS_BUCKET_REGION;
  const IdentityPoolId = process.env.AWS_IDENT_POOL_ID;

  await AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
  });

  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: albumBucketName}
  });

  //////// stack exchange answer
  buf = new Buffer(profilePicBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')
  var data = {
    Bucket: process.env.AWS_BUCKET,
    Key: photoKey,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };
  let loc;
  return new Promise((resolve, reject) => {
    s3.upload(data, (err, data) => {
      if (err) reject(err);
      resolve(data.Location);
    });
  })
}

module.exports = sendToAWS;
