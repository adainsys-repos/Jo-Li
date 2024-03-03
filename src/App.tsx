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

export default function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await axiosInstance.get("/jobs/all-jobIds", {
        headers: {
          Authorization: `Bearer ${
            document.cookie
              .split(";")
              .find((c) => c.trim().startsWith(`token=`))
              ?.split("=")[1] || null
          } `,
        },
      });

      setJobs(data.data);
    };

    fetchJobs();
  }, []);

  console.log(jobs);

  return (
    <div className="w-10/12 h-full m-auto flex flex-col py-10 ">
      <div className="flex justify-between items-center">
        <h4 className="text-white/90 text-2xl font-medium">Main Dashboard</h4>
        <Button className="bg-blue-500 px-8">Add</Button>
      </div>
      <div className="text-white/90 py-10">
        <Accordion type="single" className="space-y-4" collapsible>
          {jobs &&
            jobs.map((e) => (
              <AccordionItem
                value={e}
                className="border border-[#1C1C1C] px-8 rounded-lg"
              >
                <AccordionTrigger className="flex w-full justify-end gap-8 hover:no-underline">
                  <div className="flex w-full gap-20">
                    <p>{e.JobSource.name}</p>
                    <p>{e.jobId}</p>
                  </div>
                  <Button className="bg-[#1C1C1C] hover:bg-[#1C1C1C]/60 px-8">
                    View
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
