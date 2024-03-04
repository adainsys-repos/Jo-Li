import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStore, storeTypes } from "../../../context/store";
import { Lock, Mail } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setAuthToken } = useStore() as storeTypes;

  if (document.cookie.includes("token")) {
    return window.open("/", "_self");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      await axios
        .post("https://joli.onrender.com/api/auth/sign-in", {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          const expirationDate = new Date(Date.now() + 25892000000);
          document.cookie = `token=${
            res.data.token
          };expires=${expirationDate.toUTCString()};path=/`;
          setAuthToken(res.data.token);
        });
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="flex flex-col m-auto items-center justify-center max-w-6xl h-screen">
      <div className="bg-[#1C1C1C] h-fit w-1/3 border border-slate-950 rounded-xl px-2.5 py-4 ">
        <h3 className="text-center text-2xl font-medium text-white/90 py-3">
          JoLi
        </h3>
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
                      <Mail className=" h-4  text-white/50" strokeWidth={1.5} />

                      <Input
                        autoComplete="off"
                        className="text-white/50 bg-transparent focus-visible:bg-none relative border-none focus-visible:ring-none px-0 "
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
                      <Lock className=" h-4  text-white/50" strokeWidth={1.5} />

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
      </div>
    </div>
  );
}

