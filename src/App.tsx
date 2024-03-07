//@ts-nocheck
import { useRef } from "react";
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
import ManageUsers from "./components/ManageUsers";
import { Separator } from "./components/ui/separator";
import { useStore } from "../context/store";
import { Plus, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export default function App() {
  const [jobs, setJobs] = useState([]);

  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRefreshing = useRef<boolean>(false);

  useEffect(() => {
    const requestInterceptors = axiosInstance.interceptors.request.use(
      (config) => {
        const token = Cookies.get("A_AccessToken");
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        return config;
      }
    );
    const refreshTokenInterceptor = axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (error.response.status === 401 && !isRefreshing.current) {
          isRefreshing.current = true;
          console.log("refreshing token");
          const res = await axiosInstance.post("/auth/refresh-token", {
            refreshToken: Cookies.get("A_RefreshToken"),
          });
          Cookies.set("A_AccessToken", res.data.token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;
          return axiosInstance(error.config);
        }
        isRefreshing.current = false;
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptors);
      axiosInstance.interceptors.response.eject(refreshTokenInterceptor);
    };
  }, []);

  const { updateJobs } = useStore();
  const [userEmail, setUserEmail] = useState("");
  console.log(userEmail);

  const addUser = async (jobId) => {
    try {
      const post = await axiosInstance.post("/jobs/add-user", {
        jobId: jobId,
        email: userEmail,
      });
    } catch (e) {
      console.log(e);
    }
  };

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
  }, [, updateJobs, userEmail]);

  return (
    <div className="w-10/12 h-full m-auto flex flex-col py-10 ">
      <div className="flex justify-between items-center">
        <h4 className="text-white/90 text-2xl font-medium">Main Dashboard</h4>
        <AddJob sources={sources} />
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
                          <p>{e?.JobSource?.name}</p>
                          <p>{e?.jobId}</p>
                        </div>
                        <ManageUsers jobs={e} />
                        <AccordionTrigger className="flex w-full justify-end gap-8 hover:no-underline"></AccordionTrigger>
                      </div>
                      <AccordionContent className="space-y-3">
                        <Separator className="bg-[#1C1C1C]" />
                        <div className="flex justify-between items-center">
                          <p className="text-white/85 text-lg">
                            Users in the Job
                          </p>
                          <Dialog>
                            <DialogTrigger>
                              <Plus className="text-blue-500 p-0.5 rounded-full text-5xl" />
                            </DialogTrigger>
                            <DialogContent className="bg-[#1d1d1d] text-white/90 border-none">
                              <DialogTitle>Add User to Job</DialogTitle>
                              <div className="space-y-6 py-4">
                                <Input
                                  placeholder="Email"
                                  className="bg-[#1d1d1d] text-white/50"
                                  onChange={(e) => setUserEmail(e.target.value)}
                                />
                              </div>
                              <Button
                                className="bg-blue-500 hover:bg-blue-500"
                                onClick={() => addUser(e?.id)}
                              >
                                Add user
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="flex flex-col text-white/80 gap-2.5">
                          {e.Users.map((user) => (
                            <li>{user.email}</li>
                          ))}
                        </div>
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
