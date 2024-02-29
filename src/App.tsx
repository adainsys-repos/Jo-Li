// import { Edit, Plus } from "lucide-react";

import ChangeUserPswd from "./components/ChangeUserPswd";
import CreateUser from "./components/CreateUser";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "./components/ui/input";
// import { Button } from "./components/ui/button";

export default function App() {
  return (
    <div className="w-10/12 h-full m-auto flex flex-col py-10 ">
      {/* <div className="w-full flex flex-col gap-4">
        {[
          { name: "frontend", id: 1020 },
          { name: "backend", id: 1021 },
        ].map((item) => (
          <div className="flex items-center gap-4 space-x-4 w-full">
            <div className=" bg-[#1C1C1C] w-8/12 px-4 py-2 rounded-md">
              <p className="text-white/90 capitalize text-xl font-medium">
                {item.name}
              </p>
              <p className="text-white/90">{item.id}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center">
                <Edit className="w-5 h-5 text-white/50" strokeWidth={1.5} />
              </div>
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                <Sheet>
                  <SheetTrigger>
                    <Plus className="w-6 h-6 text-white" />
                  </SheetTrigger>
                  <SheetContent className="bg-[#100c0c]">
                    <SheetHeader>
                      <SheetTitle className="text-white">Edit Job</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-4">
                      <Select>
                        <SelectTrigger className="w-10/12 bg-[#1C1C1C] border-0 text-white/60">
                          <SelectValue placeholder="Job" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1C1C1C] border-0 text-white/60">
                          {[
                            { platform: "Linkedin", value: "linkedin" },
                            { platform: "Linkedin", value: "linkedin" },
                          ].map((e) => (
                            <SelectItem value={e.value}>
                              {e.platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="TB"
                        className="bg-[#1C1C1C] border-0 text-white/90"
                      />
                      <div className="flex gap-2">
                        <Button>Save</Button>
                        <Button>Cancel</Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        ))}
      </div> */}
      <div className="flex flex-col w-1/3 gap-4">
        <ChangeUserPswd />
        <CreateUser />
      </div>
    </div>
  );
}
