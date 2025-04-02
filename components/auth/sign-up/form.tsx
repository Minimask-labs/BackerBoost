"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SignUpSchema, SignUpSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/global/FormField";
import { FormFieldTypes } from "@/enums";
import { Button } from "@/components/ui/button";

const SignUpForm = () => {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: SignUpSchemaType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={() => handleSubmit}
      >
        <FormField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter Your Name"
          type="text"
          case={FormFieldTypes.text}
        />
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

        <Button className="btn-primary">Sign Up</Button>
        
        <div className="w-full flex gap-2 mt-5 max-sm:mt-3 items-center">
          <div className="w-1/2 h-px bg-gray-500" />
          <h2 className="text-base font-bold font-sans">OR</h2>
          <div className="w-1/2 h-px bg-gray-500" />
        </div>

        <Button className="btn-light">Create Account With Google</Button>

        {/* <Button className="btn-light">
          Create Account With Cardano Wallet
        </Button> */}
      </form>
    </Form>
  );
};

export default SignUpForm;
