//@ts-nocheck
"use client";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { FaUser } from "react-icons/fa";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "JobSource",
    header: "Job Source",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("JobSource").name}</div>
    ),
  },
  {
    accessorKey: "jobId",
    header: "Job ID",
    cell: ({ row }) => <div className="lowercase">{row.getValue("jobId")}</div>,
  },
  {
    accessorKey: "maxLogins",
    header: "Max Logins",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("maxLogins")}</div>
    ),
  },
  {
    id: "usersDropdown",
    header: "Users",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 focus:outline-none">
            <FaUser className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {row.original.Users.map((user) => (
            <DropdownMenuItem key={user.id}>{user.email}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ManageUsers jobs={row.original} />,
  },
  {
    accessorKey: "addUsers",
    header: "Add User",
    cell: ({ row }) => (
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

          <DialogClose>
            <Button
              className="bg-blue-500 hover:bg-blue-500"
              onClick={() => {
                addUser(row.original.id);
              }}
            >
              Add user
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    ),
  },
];

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

  const { updateJobs, updateUsers, setUpdateJobs } = useStore();
  const [userEmail, setUserEmail] = useState("");

  const addUser = async (jobId) => {
    try {
      const post = await axiosInstance.post("/jobs/add-user", {
        jobId: jobId,
        email: userEmail,
      });
      setUpdateJobs(true);
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
  }, [, updateJobs, updateUsers]);

  return (
    <div className="w-10/12 h-full m-auto flex flex-col py-10 ">
      <div className="flex justify-between items-center">
        <h4 className="text-white/90 text-2xl font-medium">Main Dashboard</h4>
        <AddJob sources={sources} />
      </div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Job Id..."
            value={(table.getColumn("jobId")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("jobId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
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
              {data &&
                data.map((e) => (
                  <>
                    <AccordionItem
                      value={e}
                      className="bg-black border border-[#1C1C1C] flex flex-col px-8 rounded-lg"
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

                              <DialogClose>
                                <Button
                                  className="bg-blue-500 hover:bg-blue-500"
                                  onClick={() => addUser(e?.id)}
                                >
                                  Add user
                                </Button>
                              </DialogClose>
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
