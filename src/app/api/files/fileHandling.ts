"use server";
import { File } from "@/app/models/User";

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
