"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/global/FormField";
import { FormFieldTypes } from "@/enums";
import { Button } from "@/components/ui/button";

const SignInForm = () => {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const OnSubmit = async (data: LoginSchemaType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col space-y-6"
        onSubmit={form.handleSubmit(OnSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="Enter Your Email"
          type="email"
          case={FormFieldTypes.email}
        />
        <FormField
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter Your Password"
          type="password"
          case={FormFieldTypes.password}
        />

        <Button className="btn-primary" type="submit" onSubmit={() => OnSubmit}>
          Sign In
        </Button>

        <div className="w-full flex gap-2 mt-5 max-sm:mt-3 items-center">
          <div className="w-1/2 h-px bg-gray-500" />
          <h2 className="text-base font-bold font-sans">OR</h2>
          <div className="w-1/2 h-px bg-gray-500" />
        </div>

        <Button className="btn-light">Sign In With Google</Button>

        {/* <Button className="btn-light">
         Login Using Cardano
        </Button> */}
      </form>
    </Form>
  );
};

export default SignInForm;
