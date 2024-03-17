"use server";
import { getServerSession } from "next-auth";

import { options } from "./api/auth/[...nextauth]/options";
import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { File } from "./models/User";

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
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
  const key = crypto.randomBytes(16).toString("hex");
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userEmail: session.user.email,
    },
  });
  try {
    // Generate signed URL for file upload
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    // Save file information to MongoDB
    console.log(session.user.id);
    const file = new File({
      id: session.user.id,
      fileType: type,
      fileUrl: signedUrl.split("?")[0], // Remove query parameters from the signed URL
    });

    const savedFile = await file.save();
    console.log("savedFile", savedFile);
    return { success: { url: signedUrl, savedFile: savedFile } }; // Return signed URL on success
  } catch (error) {
    console.error("Error saving file information:", error);
    return { error: { message: "Failed to save file information" } };
  }
}
