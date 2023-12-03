"use client";
import React from "react";
import { useUserValidated } from "@/hooks";
import { redirect } from "next/navigation";
import validate from "@/services/validate";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function Page() {
  const form = useForm();

  const isValidate = useUserValidated();
  if (!isValidate) redirect("/");

  return (
    <section>
      <h1>Page</h1>
      <p>Page content</p>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}

export default Page;
