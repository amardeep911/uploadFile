"use server";
import { File } from "@/app/models/User";
import {
  S3Client,
  DeleteObjectCommand,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const s3Client = new S3Client(s3ClientConfig);
export async function getFilesByUserIds(userId: string) {
  try {
    // Query files based on the user ID
    const files = await File.find({ id: userId });

    // Return the retrieved files with a status of OK (200)
    return {
      status: 200,
      body: { files },
    };
  } catch (error) {
    console.error("Error fetching files:", error);

    // Return an error response with the appropriate status code and message
    return {
      status: 500,
      body: { error: "Internal Server Error" },
    };
  }
}

export async function deleteFileById(fileId: string) {
  const session = await getServerSession(options);

  if (!session) {
    return { error: { message: "You need to be signed in" } };
  }

  try {
    // Check if the user is the owner of the file (you may have a different field for user ID in your file schema)
    const file = await File.findOne({ _id: fileId, userId: session.userId });
    if (!file) {
      return {
        error: {
          message: "File not found or you are not authorized to delete it",
        },
      };
    }

    // Delete the file from the database
    await File.deleteOne({ _id: fileId });

    // Delete the file from the S3 bucket
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.fileUrl.split("/").pop(), // Extract the file name from the URL
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error: { message: "Internal Server Error" } };
  }
}
