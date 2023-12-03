"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useUserValidated } from "@/hooks";
import { redirect } from "next/navigation";
import validate from "@/services/validate";

function Page() {
  const isValidate = useUserValidated();
  const [image, setImage] = useState<File | null>(null);
  if (!isValidate) redirect("/");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {

    const selectedImage = event.target.files && event.target.files[0];
    setImage(selectedImage)
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(typeof image)
    if (image) {
      const result = validate(image);
      console.log(result);
    }
  };

  return (
    <section>
      <h1>Page</h1>
      <p>Page content</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default Page;
