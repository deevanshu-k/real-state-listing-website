const { S3Client } = require('@aws-sdk/client-s3');

const config = {
    region: process.env.aws_regin,
    credentials: {
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key
    }
}
const s3 = new S3Client(config);

module.exports = s3;