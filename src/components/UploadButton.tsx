"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

import crypto from "crypto";
import { getSignedURL } from "@/app/action";
type Props = {};

const UploadButton = (props: Props) => {
  const [file, setfile] = useState<File | undefined>(undefined);

  const [fileUrl, setfileUrl] = useState<string | undefined>(undefined);
  const [statusMessage, setstatusMessage] = useState("");
  const [loading, setloading] = useState(false);

  const buttonDisabled = loading || !file;
  const calculateChecksum = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);
        const calculatedChecksum = crypto
          .createHash("sha256")
          .update(buffer)
          .digest("hex");
        resolve(calculatedChecksum);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setfile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setfileUrl(url);
    } else {
      setfileUrl(undefined);
    }
  };
  console.log(file);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setstatusMessage("Creating");
    setloading(true);

    // console.log({ file });

    const checksum = file ? await calculateChecksum(file) : "";
    // how to create checksum for this file

    if (file) {
      setstatusMessage("Uploading file");

      const signedUrlResult = await getSignedURL(
        file.type,
        file.size,
        checksum
      );
      if (signedUrlResult.error) {
        setstatusMessage("Failed");
        setloading(false);
        console.log(signedUrlResult.error.message);
        return;
      }
      const url = signedUrlResult.success?.url;

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file?.type || "",
        },
      });
    }

    setstatusMessage("Finished");
    setloading(false);
  };

  const [isOpen, setisOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setisOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setisOpen(true)} asChild>
        <Button>Upload Pdf</Button>
      </DialogTrigger>

      <DialogContent>
        <div className="flex flex-col justify-center align-middle text-center">
          <h2 className="text-lg font-bold mb-4">
            Upload the file you want to store
          </h2>
          <form
            className="flex flex-col"
            action="/api/upload"
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <input
              type="file"
              name="media"
              accept="image/jpeg"
              onChange={onHandleChange}
              className="mb-4"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={buttonDisabled}
            >
              Upload
            </button>
          </form>
          {fileUrl && (
            <div className="flex flex-col justify-center align-middle text-center items-center">
              <h2 className="text-lg font-bold mt-4">Preview</h2>
              <img src={fileUrl} alt="preview" width={200} height={200} />
            </div>
          )}
          {statusMessage && (
            <h1 className="text-xl font-bold mt-4">{statusMessage}</h1>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
