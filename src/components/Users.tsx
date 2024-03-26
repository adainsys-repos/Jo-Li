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
import { FaUser } from "react-icons/fa";
import { useStore } from "../../context/store";
import { Mail } from "lucide-react";

export default function Users({
  jobs,
}: {
  jobs: { id: string; Users: any[] };
}) {
  const [userEmail, setUserEmail] = useState("");
  const { setUpdateJobs } = useStore();

  const addUser = async (jobId: any) => {
    try {
      await axiosInstance.post("/jobs/add-user", {
        jobId: jobId,
        email: userEmail,
      });
      setUpdateJobs(true);
      userEmail("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeactivate = async ({ email, jobId }: { email: string; jobId: string }) => {
    await axiosInstance.post("/cookies/admin-deactivate-user-job-cookies", {
      jobId: jobId,
      email: email,
    });
  }

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button className="bg-transparent hover:bg-transparent">
            <FaUser className="size-6 text-black/50 bg-gray-200 p-1 rounded-full" />
          </Button>
        </SheetTrigger>
        <SheetContent className="border-none !max-w-[40vw]">
          <SheetHeader>
            <SheetTitle className="text-black/90">Users</SheetTitle>
            <div className="space-y-10 py-4">
              <div className="space-y-2">
                {jobs?.userJobConnections?.map(
                  (job) => (
                    console.log(job),
                    (
                      <div className="flex items-center gap-2">
                        <Mail className="text-black/70" size={18} />{" "}
                        {job?.User?.email} {job.isActivated && <div className="flex ml-auto gap-2"><span className="text-purple-500 font-semibold ml-auto text-sm p-2">Active</span>
                          {/* <button type="button" onClick={() => { handleDeactivate({ email: job?.User?.email, jobId: jobs?.id }) }} className="p-2 rounded-md bg-red-500 text-sm text-white">Deactivate</button> */}
                        </div>}
                      </div>
                    )
                  )
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-black/90 text-lg font-medium">Add User</p>
                <div className="space-y-6 py-2">
                  <Input
                    placeholder="Email"
                    className="text:text-white/50"
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => addUser(jobs?.id)}
                >
                  Add user
                </Button>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
