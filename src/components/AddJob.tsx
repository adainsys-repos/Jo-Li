//@ts-nocheck
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { useStore } from "../../context/store";
import { toast } from "./ui/use-toast";

export default function AddJob({ sources }) {
  // const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [jobId, setJobId] = useState("");
  const { updateJobs, setUpdateJobs } = useStore();

  const Submit = async () => {
    try {
      await axiosInstance.post("/jobs/job-id", {
        jobSourceId: selectedSource,
        jobId: jobId,
      });
      setUpdateJobs(!updateJobs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Duplicate Id not allowed",
        variant: "destructive",
      })

    }

  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-indigo-500 hover:bg-blue-600 px-8">Add</Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-none">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <div className="pt-6">
            <div className="space-y-4 pb-8">
              <Select>
                <SelectTrigger className="bg-white  focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent className="bg-white  text-black/80 ">
                  {sources.map((e) => (
                    <SelectItem
                      key={e?.id}
                      value={e?.name}
                      onMouseDownCapture={() => setSelectedSource(e.id)}
                      className="focus:bg-[#242424] focus:text-white "
                    >
                      {e?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Job ID"
                onChange={(e) => setJobId(e.target.value)}
              />
            </div>
            <DialogClose className="w-fit float-end">
              <Button
                onClick={() => Submit()}
                className="bg-blue-500  hover:bg-blue-600 px-8"
              >
                Submit
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
