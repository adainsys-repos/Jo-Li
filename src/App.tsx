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
import { ThemeProvider } from "@/components/theme-provider";

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

import { Moon, Sun } from "lucide-react";
import Users from "./components/Users";

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
    cell: ({ row }) => (
      <div className="text-indigo-600">{row.getValue("jobId")}</div>
    ),
  },
  {
    accessorKey: "maxLogins",
    header: "Max Logins",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("maxLogins")}</div>
    ),
  },
  {
    accessorKey: "activeLogins",
    header: "Active Logins",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("activeLogins")}</div>
    ),
  },
  {
    accessorKey: "Approve",
    header: "Approve",
    cell: ({ row }) => (
      <>
        {row.original.Cookies === null ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-20 font-normal border-none bg-purple-500 hover:bg-purple-600 hover:text-white text-white"
            onClick={() => row.toggleAllSelected()}
          >
            Enable
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-20 font-normal border-none bg-rose-500 hover:bg-rose-600 hover:text-white text-white"
            onClick={() => row.toggleAllSelected()}
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
    cell: ({ row }) => <ManageUsers jobs={row.original} />,
  },
  {
    id: "usersDropdown",
    header: "Users",
    cell: ({ row }) => <Users jobs={row.original} />,
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

  const [currentPage, setCurrentPage] = useState(0);

  const fetchData = async () => {
    try {
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
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [updateJobs, updateUsers,currentPage]);

  return (
    <div className="w-10/12 h-10 m-auto flex flex-col py-10">
      <div className="flex justify-between items-center">
        <h4 className="text-black/80  text-2xl font-bold">Main Dashboard</h4>
        <div className="flex gap-3">
          <AddJob sources={sources} />
        </div>
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
            <TableHeader className="bg-gray-200">
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
              {table.getRowModel().rows?.length ? (
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
