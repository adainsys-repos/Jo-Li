import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import axiosInstance from "../../config/axiosInstance";

export default function ManageUsers({
  jobs,
}: {
  jobs: { id: string; Users: any[] };
}) {
  const [maxLogins, setMaxLogins] = useState(0);

  const editMaxLogins = async () => {
    try {
      await axiosInstance.put("/jobs/edit-max-logins", {
        jobId: jobs?.id,
        maxLogins: Number(maxLogins),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button className="bg-[#222222] hover:bg-[#222222]/60 px-8">
            Manage
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[#141414] text-white border-none">
          <SheetHeader>
            <SheetTitle className="text-white/90">Manage Users</SheetTitle>
            <div className="space-y-10 py-4">
              <div className="space-y-2">
                <p className="font-normal">Users</p>
                {jobs?.Users.map((job) => (
                  <li className="text-white/90">{job.email}</li>
                ))}
              </div>
              <div className="space-y-4">
                <p>Edit Max Logins For the Job</p>
                <Input
                  onChange={(e: any) => setMaxLogins(e.target.value)}
                  placeholder="Max number of logins allowed"
                  className="bg-[#141414] border-[#6e6e6e]"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-500 px-8"
                  onClick={() => editMaxLogins()}
                >
                  Save
                </Button>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
