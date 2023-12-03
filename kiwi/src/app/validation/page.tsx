"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useUserValidated } from "@/hooks";
import { redirect } from "next/navigation";
import validate from "@/services/validate";
import { Redressed } from "next/font/google";

function Page() {
  const isValidate = useUserValidated();
  const [image, setImage] = useState("");
  if (!isValidate) redirect("/");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files && event.target.files[0];

    if (selectedImage) {
      const reader = new FileReader()
      reader.onload = () => {
        const b64Image = reader.result
        if (typeof b64Image === 'string') {
          setImage(b64Image)
        }
      }
      reader.readAsDataURL(selectedImage)
    }

  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(validate(image))
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
