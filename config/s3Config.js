import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: {
      accessKeyId: process.env.PASSW_S3, 
      secretAccessKey: process.env.PASSW_SECRET,
    },
    region: "global",
  });

export {s3}