import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ManageUsers({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button className="bg-[#222222] hover:bg-[#222222]/60 px-8">
            Manage
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[#141414] text-white border-none">
          <SheetHeader>
            <SheetTitle className="text-white/90">Manage Users</SheetTitle>
            <div className="space-y-4">
              <p>Edit Max Logins For the Job</p>
              <Input
                placeholder="Job ID"
                className="bg-[#141414] border-[#6e6e6e]"
              />
              <Button className="bg-blue-600 hover:bg-blue-500 px-8">
                Save
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
