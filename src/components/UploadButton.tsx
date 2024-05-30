"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import crypto from "crypto";
import { getSignedURL } from "@/app/action";
import Dropzone from "react-dropzone";
import Image from "next/image";

type Props = {
  onFileUploaded: () => void;
};

const UploadButton = ({ onFileUploaded }: Props) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      setFileUrl(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatusMessage("Creating");
    setLoading(true);

    const checksum = file ? await calculateChecksum(file) : "";

    if (file) {
      setStatusMessage("Uploading file");

      const signedUrlResult = await getSignedURL(
        file.type,
        file.size,
        checksum
      );
      if (signedUrlResult.error) {
        setStatusMessage("Failed");
        setLoading(false);
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
      setIsOpen(false);
      setFile(undefined);
      setFileUrl(undefined);
      setStatusMessage("");
    }

    setStatusMessage("");
    setLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <Dropzone
          multiple={false}
          onDrop={(acceptedFiles) => {
            setFile(acceptedFiles[0]);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
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
                <div className="w-full flex-row justify-cente text-center m-auto text-muted-foreground">
                  <h2 className="mb-2 font-semibold text-2xl">Preview</h2>
                  <Image
                    src={fileUrl}
                    alt="preview"
                    layout="responsive"
                    width={500}
                    height={300}
                    className="border border-gray-300 rounded-lg items-center overflow-hidden"
                  />
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
