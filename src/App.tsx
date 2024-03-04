
import { Button } from "./components/ui/button";
import { useRef } from "react"
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
import Cookies from "js-cookie";

export default function App() {
  const [jobs, setJobs] = useState([]);

  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRefreshing = useRef<boolean>(false)


  useEffect(() => {
    const requestInterceptors = axiosInstance.interceptors.request.use((config) => {
      const token = Cookies.get("A_AccessToken")
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return config
    })
    const refreshTokenInterceptor = axiosInstance.interceptors.response.use((res) => {
      return res
    }, async (error) => {
      if (error.response.status === 401 && !isRefreshing.current) {
        isRefreshing.current = true
        console.log("refreshing token")
        const res = await axiosInstance.post("/auth/refresh-token", {
          refreshToken: Cookies.get("A_RefreshToken")
        })
        Cookies.set("A_AccessToken", res.data.token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        return axiosInstance(error.config)
      }
      isRefreshing.current = false
      return Promise.reject(error)
    })
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptors)
      axiosInstance.interceptors.response.eject(refreshTokenInterceptor)
    }
  }, [])



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
                      className="border border-[#1C1C1C] px-8 rounded-lg"
                    >
                      <AccordionTrigger className="flex w-full justify-end gap-8 hover:no-underline">
                        <div className="flex w-full gap-20">
                          <p>{e?.JobSource?.name}</p>
                          <p>{e?.jobId}</p>
                        </div>
                        <Button className="bg-[#222222] hover:bg-[#222222]/60 px-8">
                          View
                        </Button>
                      </AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
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
