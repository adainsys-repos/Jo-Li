//@ts-nocheck
import { Button } from "./components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import AddJob from "./components/AddJob";
import { Skeleton } from "./components/ui/skeleton";
import ManageUsers from "./components/ManageUsers";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobData = await axiosInstance.get("/jobs/all-jobIds");
        const sourceData = await axiosInstance.get("/jobs/job-sources");
        setJobs(jobData.data);
        setSources(sourceData.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  console.log(jobs);

  return (
    <div className="w-10/12 h-full m-auto flex flex-col py-10 ">
      <div className="flex justify-between items-center">
        <h4 className="text-white/90 text-2xl font-medium">Main Dashboard</h4>
        <AddJob />
      </div>
      <div className="text-white/90 py-10">
        <Accordion type="single" className="space-y-4" collapsible>
          {loading ? (
            <>
              <div className="space-y-6">
                <Skeleton className="w-full h-14 bg-[#1C1C1C]" />
                <Skeleton className="w-full h-14 bg-[#1C1C1C]" />
                <Skeleton className="w-full h-14 bg-[#1C1C1C]" />
              </div>
            </>
          ) : (
            <>
              {jobs &&
                jobs.map((e) => (
                  <>
                    <AccordionItem
                      value={e}
                      className="border border-[#1C1C1C] flex flex-col px-8 rounded-lg"
                    >
                      <div className="flex w-full gap-4 items-center py-3">
                        <div className="flex w-full gap-20">
                          <p>{e.JobSource.name}</p>
                          <p>{e.jobId}</p>
                        </div>
                        <ManageUsers userId={"ef"} email={"id"} />
                        <AccordionTrigger className="flex w-full justify-end gap-8 hover:no-underline"></AccordionTrigger>
                      </div>
                      <AccordionContent>
                        {e.Users.map((user) => (
                          <p>{user.email}</p>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </>
                ))}
            </>
          )}
        </Accordion>
      </div>
    </div>
  );
}
