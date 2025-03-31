"use client";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormFieldTypes } from "@/enums";
import { useState } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type: "password" | "text" | "email";
  required?: boolean;
  disabled?: boolean;
  case: FormFieldTypes;
}

const RenderField = <T extends FieldValues>({
  props,
  field,
}: {
  props: FormFieldProps<T>;
  field: ControllerRenderProps<any, string>;
}) => {
  // FOR PASSWORD STATE
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  switch (props.case) {
    case FormFieldTypes.email:
      return (
        <Input
          {...field}
          className=""
          type={props.type}
          required={props.required}
          placeholder={props.placeholder}
          aria-placeholder={props.placeholder}
        />
      );

    case FormFieldTypes.password:
      return (
        <div className="flex gap-2 rounded">
          <Input
            {...field}
            className=""
            type={props.type}
            required={props.required}
            placeholder={props.placeholder}
            aria-placeholder={props.placeholder}
          />
        </div>
      );

    case FormFieldTypes.text:
      return (
        <div>
          <Input
            {...field}
            className=""
            type={props.type}
            required={props.required}
            placeholder={props.placeholder}
            aria-placeholder={props.placeholder}
          />
        </div>
      );

    default:
      break;
  }
};

const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm leading-normal">
            {props.label}
          </FormLabel>
          <FormControl>
            <RenderField field={field} props={props} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
