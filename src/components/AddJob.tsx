
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

export default function AddJob() {
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [jobId, setJobId] = useState("");

  const Submit = async () => {
    await axiosInstance.post("/jobs/job-id", {
      jobSourceId: selectedSource,
      jobId: jobId,
    });
  };

  useEffect(() => {
    const fetchJobSources = async () => {
      const data = await axiosInstance.get("/jobs/job-sources");
      setSources(data.data);
    };
    fetchJobSources();
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-blue-500 px-8">Add</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1d1d1d] text-white/90 border-none">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <div className="pt-6">
            <div className="space-y-4 pb-8">
              <Select>
                <SelectTrigger className="bg-[#1d1d1d] focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent className="bg-[#1d1d1d] text-white/80 ">
                  {sources.map((e: unknown) => (
                    <SelectItem
                      key={e.id}
                      value={e.name}
                      onMouseDown={() => setSelectedSource(e.id)}
                      className="focus:bg-[#242424] focus:text-white/80"
                    >
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Job ID"
                className="bg-[#1d1d1d] text-white/80"
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
