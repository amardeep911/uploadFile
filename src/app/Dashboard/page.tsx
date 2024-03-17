"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UploadButton from "@/components/UploadButton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Session {
  id: string; // Add the id property
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}

import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteFileById, getFilesByUserIds } from "../api/files/fileHandling";
import Image from "next/image";

type Props = {};

const Page = (props: Props) => {
  const { data: session }: any = useSession({
    required: true,
    onUnauthenticated() {
      redirect("api/auth/signin?callbackUrl=/Dashboard");
    },
  });
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session?.user) {
      fetchFilesByUserId(session.user.id);
    }
  }, [session]);

  const fetchFilesByUserId = async (userId: any) => {
    try {
      const response = await getFilesByUserIds(userId);
      console.log(response);
      if (response && response.body.files) {
        setFiles(response.body.files);
      } else {
        console.error("Error fetching files:", response.status);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false); // Set loading state to false when fetching is complete
    }
  };
  console.log(files);
  const handleFileUploaded = () => {
    // Refetch files list after file upload
    setLoading(true); // Set loading state to true when a file is uploaded
    fetchFilesByUserId(session?.user?.id); // Add null checks for session.user
  };

  const handleFileDeleted = async (fileId: string) => {
    // Refetch files list after file delete
    setLoading(true); // Set loading state to true when a file is deleted
    await deleteFileById(fileId); // Call deleteFileById to delete the file
    fetchFilesByUserId(session?.user?.id); // Add null checks for session.user
  };

  return (
    <>
      <MaxWidthWrapper className="bg-gray-100  sticky top-16 sm:p-5 p-2 z-20 w-full align-middle items-center  inset-x-0 h-fit ">
        <div className=" flex justify-between ">
          <h1 className="text-2xl text-black ml-10 mt-2">Files</h1>
          <UploadButton onFileUploaded={handleFileUploaded} />
        </div>
      </MaxWidthWrapper>
      <div className="z-0 top-0 w-full  inset-x-0 h-screen flex justify-between p-5b bg-gray-100 ">
        <MaxWidthWrapper className="w-full max-h-full sticky top-0 ">
          {/* //all the file uploded will be view here in this div */}
          <div>
            <div className="flex justify-center align-middle items-center mt-5">
              {loading ? (
                <ul className="flex flex-wrap justify-start gap-5 p-5">
                  {/* Display at least six skeleton placeholders */}
                  {[...Array(Math.max(8, files.length))].map((_, index) => (
                    <li key={index}>
                      <Skeleton className="h-60 w-60" />
                    </li>
                  ))}
                </ul>
              ) : (
                // Render fetched images
                <ul className="grid sm:grid-cols-5 grid-cols-2 gap-5">
                  {files.map((file: any) => (
                    <li
                      key={file._id}
                      className="border border-gray-300 rounded-lg items-center overflow-hidden"
                    >
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <Image
                            className="object-cover w-60 h-60 items-center hover:cursor-pointer hover:opacity-80"
                            src={file.fileUrl}
                            alt={file.name}
                            width={60}
                            height={60}
                          />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem>Donwload</ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              window.open(file.fileUrl, "_blank");
                            }}
                          >
                            Preview
                          </ContextMenuItem>
                          <ContextMenuItem>Share</ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              handleFileDeleted(file._id);
                            }}
                          >
                            Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
};

export default Page;
