import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail } from "lucide-react";
import axiosInstance from "../../../config/axiosInstance";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function SignIn() {

  const { pathname } = useLocation()

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    console.log(pathname)
    if (pathname === "/signin" && Cookies.get("A_AccessToken")) {
      navigate("/");
    }
  }, [pathname]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });



  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      await axiosInstance
        .post("/auth/sign-in", {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          Cookies.set("A_AccessToken", res.data.tokens.accessToken);
          Cookies.set("A_RefreshToken", res.data.tokens.refreshToken, {
            expires: 3,
          });
          setLoading(false)
          toast({
            description: "Sign in successful",
            title: "Sign in success",
            variant: "default",
          })
          navigate("/");
        });
    } catch (e) {
      console.log(e?.response?.data.message)
      toast({
        description: e?.response?.data.message,
        title: "Sign in failed",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col m-auto items-center justify-center max-w-6xl h-screen">
      <div className="h-fit w-4/12 border rounded-xl px-2.5 py-4">
        <h3 className="text-center text-black/80 text-3xl font-bold py-3">
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
                    <div className="bg-gray-100/50 flex gap-3 w-full items-center justify-center rounded-md px-2 ">
                      <Mail className=" h-4 text-black/50" strokeWidth={1.5} />

                      <Input
                        disabled={loading}
                        autoComplete="off"
                        className=" bg-transparent focus-visible:bg-none relative border-none focus-visible:ring-none px-0 "
                        placeholder="Email"
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
                    <div className="bg-gray-100/50 flex gap-3 w-full items-center justify-center rounded-md px-2 ">
                      <Lock
                        className=" h-4 text-black/50  "
                        strokeWidth={1.5}
                      />

                      <Input
                        disabled={loading}
                        type="password"
                        className=" bg-transparent relative border-none focus-visible:border-none focus-visible:ring-none px-0 "
                        placeholder="Password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 h-9 shadow-md hover:bg-blue-500"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
