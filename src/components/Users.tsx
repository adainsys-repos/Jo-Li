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

  console.log(jobs);

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

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button className="px-8 bg-transparent hover:bg-transparent">
            <FaUser className="h-4 w-4 text-black" />
          </Button>
        </SheetTrigger>
        <SheetContent className="border-none">
          <SheetHeader>
            <SheetTitle className="text-black/90">Edit Users</SheetTitle>
            <div className="space-y-10 py-4">
              <div className="space-y-2">
                <p className="text-lg text-black/90 font-medium">Users</p>
                {jobs?.userJobConnections?.map(
                  (job) => (
                    console.log(job),
                    (
                      <div className="flex items-center gap-2">
                        <Mail className="text-black/70" size={18} /> {job?.User?.email}
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
