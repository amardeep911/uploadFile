"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

import crypto from "crypto";
import { getSignedURL } from "@/app/action";
import Dropzone from "react-dropzone";
import { set } from "react-hook-form";
type Props = {
  onFileUploaded: () => void;
};

const UploadButton = ({ onFileUploaded }: Props) => {
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
      const { url, savedFile } = signedUrlResult.success;
      console.log(savedFile._id);
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file?.type || "",
        },
      });
      onFileUploaded();
      setisOpen(false);
      setfile(undefined);
      setfileUrl(undefined);
      setstatusMessage("");
    }

    setstatusMessage("");
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
        <Button>Upload</Button>
      </DialogTrigger>

      <DialogContent>
        <Dropzone
          multiple={false}
          onDrop={(acceptedFiles) => {
            setfile(acceptedFiles[0]);
            setfileUrl(URL.createObjectURL(acceptedFiles[0]));
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section className="flex flex-col justify-center align-middle items-center gap-5">
              <div {...getRootProps()} className="flex justify-center">
                <input {...getInputProps()} />
                {file ? (
                  ""
                ) : (
                  <p>
                    Drag and drop some files here, or{" "}
                    <span className="text-blue-700 cursor-pointer">click</span>{" "}
                    to select files
                  </p>
                )}
              </div>

              {fileUrl && (
                <div>
                  <h2>Preview</h2>
                  <img src={fileUrl} alt="preview" />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <Button type="submit" disabled={buttonDisabled}>
                  Upload
                </Button>
              </form>
              <section>{statusMessage && <p>{statusMessage}</p>}</section>
            </section>
          )}
        </Dropzone>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
