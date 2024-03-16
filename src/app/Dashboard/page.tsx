"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UploadButton from "@/components/UploadButton";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import { getFilesByUserIds } from "../api/files/fileHandling";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const page = (props: Props) => {
  const { data: session } = useSession({
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
    fetchFilesByUserId(session.user.id);
  };
  return (
    <div className="z-50 top-0 w-full  inset-x-0 h-screen flex justify-between p-5">
      <MaxWidthWrapper className="w-full max-h-full border-4 rounded-xl border-black">
        <div className="border-b border-gray-200 sticky z-50 top-0 flex justify-end w-full align-middle items-center  inset-x-0 h-16 ">
          <UploadButton onFileUploaded={handleFileUploaded} />
        </div>
        {/* //all the file uploded will be view here in this div */}
        <div>
          <h1 className="text-2xl text-black">Files</h1>
          {loading ? (
            <ul className="flex flex-wrap justify-start gap-5 p-5">
              {/* Display at least six skeleton placeholders */}
              {[...Array(Math.max(8, files.length))].map((_, index) => (
                <li>
                  <Skeleton className="h-60 w-60" />
                </li>
              ))}
            </ul>
          ) : (
            // Render fetched images
            <ul className="flex flex-wrap justify-start gap-5 p-5">
              {files.map((file: any) => (
                <li
                  key={file._id}
                  className="border border-gray-300 rounded-lg overflow-hidden"
                >
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <img
                        className="object-cover w-60 h-60 hover:cursor-pointer"
                        src={file.fileUrl}
                        alt={file.name}
                      />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Donwload</ContextMenuItem>
                      <ContextMenuItem>Preview</ContextMenuItem>
                      <ContextMenuItem>Share</ContextMenuItem>
                      <ContextMenuItem>Fav</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </li>
              ))}
            </ul>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
