import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "./ui/use-toast";

export default function ManageUsers({
  jobs,
  refreshFunction,
}: {
  jobs: { id: string; Users: any[]; maxLogins: number; activeLogins: number };
  refreshFunction: () => void;
}) {
  const [maxLogins, setMaxLogins] = useState(0);

  const editMaxLogins = async () => {
    if (maxLogins < jobs.activeLogins) {
      toast({
        title: "Error",
        description: "Max Logins cannot be less than Active Logins",
        variant: "destructive",
      })
    } else {
      try {
        await axiosInstance.put("/jobs/edit-max-logins", {
          jobId: jobs?.id,
          maxLogins: Number(maxLogins),
        });
        refreshFunction();
      } catch (e) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
      }
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="flex items-center gap-2.5 text-white bg-indigo-400 px-4 py-2 rounded-md">
          Manage
        </DialogTrigger>
        <DialogContent className="text- border-none">
          <DialogHeader>
            <DialogTitle>Edit Max Logins For the Job</DialogTitle>
            <div className="space-y-10 py-4">
              <div className="space-y-4">
                <Input
                  onChange={(e: any) => setMaxLogins(e.target.value)}
                  placeholder={jobs.maxLogins.toString()}
                  className="bg-black/10 border-[#6e6e6e]"
                />
              </div>
            </div>
            <DialogClose>
              <Button
                className="bg-blue-600 hover:bg-blue-500 px-8 float-right"
                onClick={() => editMaxLogins()}
              >
                Save
              </Button>
            </DialogClose>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
