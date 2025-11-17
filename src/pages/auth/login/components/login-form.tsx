import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loginSchema, type LoginSchemaType } from "@/validators/auth-validator";

const LoginForm = () => {
  const [isView, setIsView] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (value: LoginSchemaType) => {
    console.log(value);
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        <div>
          <h2 className="font-medium text-2xl">Login Account</h2>
          <p className="text-muted-foreground text-sm">
            Access your dashboard to manage smart environments.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Input your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isView ? "text" : "password"}
                      placeholder="Input your password"
                      {...field}
                    />
                    {isView ? (
                      <Eye
                        className="absolute size-5 right-4 top-2 z-10 cursor-pointer text-gray-500"
                        onClick={() => setIsView(!isView)}
                      />
                    ) : (
                      <EyeOff
                        className="absolute size-5 right-4 top-2 z-10 cursor-pointer text-gray-500"
                        onClick={() => setIsView(!isView)}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            to="#"
            className="text-sm inline-block font-light text-blue-500 underline"
          >
            Forgot password?
          </Link>
          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
        </form>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </Form>
  );
};

export default LoginForm;
