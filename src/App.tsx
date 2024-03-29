
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRef } from "react";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import AddJob from "./components/AddJob";

import Cookies from "js-cookie";
import ManageUsers from "./components/ManageUsers";
import { useStore } from "../context/store";
import { io } from "socket.io-client";
import Users from "./components/Users";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./components/ui/skeleton";
import { Progress } from "./components/ui/progress";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { toast } from "./components/ui/use-toast";

export default function App() {
  const [data, setJobs] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRefreshing = useRef<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { updateJobs, updateUsers, setUpdateJobs } = useStore();
  const [searchData, setSearchData] = useState("");
  const [debounceData] = useDebounce(searchData, 500);

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

  // const { updateJobs, updateUsers, setUpdateJobs } = useStore();

  // const addUser = async (jobId) => {
  //   try {
  //     const post = await axiosInstance.post("/jobs/add-user", {
  //       jobId: jobId,
  //       email: userEmail,
  //     });
  //     setUpdateJobs(true);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = async () => {
    try {
      const jobData = await axiosInstance.get("/jobs/all-jobIds", {
        params: {
          search: debounceData ?? "",
          skip: currentPage,
          take: 10,
        },
      });
      const sourceData = await axiosInstance.get("/jobs/job-sources");
      setJobs(jobData.data.jobs);
      setSources(sourceData.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async ({ jobId, jobSourceId }: { jobId: string, jobSourceId: string }) => {
    try {
      await axiosInstance.delete("/jobs/job-id", {
        data: {
          jobSourceId: jobSourceId,
          jobId: jobId,
        }
      });

      toast({
        title: "Success",
        description: "Deleted JobId",
      })

      fetchData()

    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })

    }
  }

  useEffect(() => {
    fetchData();
  }, [debounceData, updateJobs, updateUsers, currentPage]);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("user-login-state", async (user: any) => {
      console.log(console.log(user));
      const jobData = await axiosInstance.get("/jobs/all-jobIds", {
        params: {
          search: "",
          skip: currentPage,
          take: 10,
        },
      });
      const sourceData = await axiosInstance.get("/jobs/job-sources");
      setJobs(jobData.data.jobs);
      setSources(sourceData.data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleEnable = async (jobId: any) => {
    try {
      await axiosInstance.post("/cookies/open", {
        jobId: jobId,
      });
      const jobData = await axiosInstance.get("/jobs/all-jobIds", {
        params: {
          search: "",
          skip: currentPage,
          take: 10,
        },
      });
      const sourceData = await axiosInstance.get("/jobs/job-sources");
      setJobs(jobData.data.jobs);
      setSources(sourceData.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDisable = async (jobId: any) => {
    try {
      await axiosInstance.put("/jobs/clean-jobId-cookie", {
        jobId: jobId,
      });
      const jobData = await axiosInstance.get("/jobs/all-jobIds", {
        params: {
          search: "",
          skip: currentPage,
          take: 10,
        },
      });
      const sourceData = await axiosInstance.get("/jobs/job-sources");
      setJobs(jobData.data.jobs);
      setSources(sourceData.data);
    } catch (e) {
      console.log(e);
    }
  };

  const columns: ColumnDef<Payment>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "JobSource",
      header: "Job Source",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("JobSource").name === "Monster" ? <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Foundit-Logo.svg/1280px-Foundit-Logo.svg.png" alt="Logo" className="w-12" /> : <img src="https://static.naukimg.com/s/0/0/i/ni-hamburger/NaukriLogo.png" alt="Logo" className="w-12" />}
          {row.getValue("JobSource").name}
        </div>
      ),
    },
    {
      accessorKey: "jobId",
      header: "Job ID",
      cell: ({ row }) => (
        <div className="text-indigo-600">{row.getValue("jobId")}</div>
      ),
    },
    {
      accessorKey: "maxLogins",
      header: "User Logins",
      cell: ({ row }) => (
        // console.log((row.original.activeLogins / row.original.maxLogins) * 100),
        <div className="font-medium flex items-center gap-3 min-w-fit">

          <Progress indicatorColor={(row.original.activeLogins / row.original.maxLogins) * 100 > 50 ? "bg-indigo-600" : "bg-blue-400"} value={(row.original.activeLogins / row.original.maxLogins) * 100} className="h-2.5" />
          <div className="flex min-w-[3rem]">
            {row.original.activeLogins} / {row.original.maxLogins}
          </div>
        </div>
      ),
    },

    {
      accessorKey: "Approve",
      header: "Cookie Action",
      cell: ({ row }) => (
        <>
          {row.original.Cookies === null ? (
            <Button
              size="sm"
              onClick={() => handleEnable(row.original.id)}
              variant="outline"
              className="h-8 w-20 font-normal border-none bg-indigo-500 hover:bg-indigo-600 hover:text-white text-white"
            >
              Enable
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-20 font-normal border-none bg-rose-500 hover:bg-rose-600 hover:text-white text-white"
              onClick={() => handleDisable(row.original.id)}
            >
              Disable
            </Button>
          )}
        </>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ManageUsers refreshFunction={fetchData} jobs={row.original} />,
    },
    {
      id: "usersDropdown",
      header: "Users",
      cell: ({ row }) => <Users jobs={row.original} />,
    },
    {
      id: "usersDelete",
      header: "",
      cell: ({ row }) =>
        <Dialog>
          <DialogTrigger>
            <Button type="button" variant={"ghost"} className="opacity-55 size-14 text-rose-600"><Trash2 /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Job</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this JobId?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={"outline"}
                className="h-8 w-20 font-normal border-none bg-rose-500 hover:bg-rose-600 hover:text-white text-white"
                onClick={() => handleDelete({ jobId: row.original.id, jobSourceId: row.original.JobSource.id })}
              >Yes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const navigate = useNavigate();

  return (
    <div className="w-10/12 h-10 m-auto flex flex-col py-10">
      <div className="flex justify-between items-center">
        <h4 className="text-black/80  text-2xl font-bold">Main Dashboard</h4>
        <div className="flex gap-3">
          <AddJob sources={sources} />
          <Button
            onClick={() => {
              Cookies.remove("A_AccessToken");
              navigate("/signin");
            }}
            className="bg-red-700/80 hover:bg-red-800/90"
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Job Id..."
            value={searchData}
            onChange={(event) => {
              setSearchData(event.target.value);
            }}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-medium text-black/80"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data ? (
                loading ? (
                  [1, 2, 3, 4, 5].map(() => (
                    <TableRow className="font-medium text-black/70 h-20">
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          <Skeleton className="w-full h-2 bg-black/10" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className="font-medium text-black/70"
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((old) => old - 10);
              }}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((old) => old + 10);
              }}
              disabled={table.getFilteredRowModel().rows.length < 10}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
