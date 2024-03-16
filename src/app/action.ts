"use server";
import { getServerSession } from "next-auth";

import { options } from "./api/auth/[...nextauth]/options";
import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const s3Client = new S3Client(s3ClientConfig);

const acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"];

const MaxFileSize = 1024 * 1024 * 10; // 10MB

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  const session = await getServerSession(options);

  if (!session) {
    return { error: { message: "You need to be signed in" } };
  }

  if (size > MaxFileSize) {
    return { error: { message: "File size too large" } };
  }

  if (!acceptedFileTypes.includes(type)) {
    return { error: { message: "File type not supported" } };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: crypto.randomBytes(16).toString("hex"),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userEmail: session.user.email,
    },
  });
  const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: 60,
  });
  return { success: { url: signedUrl } };
}
