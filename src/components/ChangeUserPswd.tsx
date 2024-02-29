import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Lock, Mail } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function ChangeUserPswd() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function getTokenFromCookie() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("token=")) {
        return cookie.substring("token=".length);
      }
    }
    return null;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      await axios.post(
        "https://joli.onrender.com/api/users/change-password",
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromCookie()}`,
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="w-full">Change User Password</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1C1C1C] border-none">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="bg-[#100C0C] flex gap-1 w-full items-center justify-center rounded-md px-2 ">
                        <Mail
                          className=" h-4  text-white/50"
                          strokeWidth={1.5}
                        />

                        <Input
                          className="text-white/50 bg-transparent relative border-none focus-visible:ring-none px-0 "
                          placeholder="email address"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="bg-[#100C0C] flex gap-1 w-full items-center justify-center rounded-md px-2 ">
                        <Lock
                          className=" h-4  text-white/50"
                          strokeWidth={1.5}
                        />

                        <Input
                          type="password"
                          className="text-white/50 bg-transparent relative border-none focus-visible:border-none focus-visible:ring-none px-0 "
                          placeholder="Password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 h-9 shadow-md hover:bg-blue-500"
              >
                Login
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
