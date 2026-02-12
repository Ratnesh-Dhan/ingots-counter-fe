"use client";
import axios from "axios";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [ingotCount, setIngotCount] = useState<number | null>(null);

  const handleButtonClick = () => {
    setIngotCount(null);
    fileInputRef.current?.click();
    setResult(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected:", file);
      setImage(file);
    }
  };

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setImage(file);
  //   }
  // };
  const handleDetect = async () => {
    if (image) {
      console.log(image);
      const formData = new FormData();
      formData.append("file", image);
      try {
        const response = await axios.post(
          "http://172.19.4.34:8000/predict",
          formData,
          { responseType: "blob" },
        );
        console.log(response.data);
        const count = response.headers["x-count"];
        console.log(count);
        setIngotCount(Number(count));
        const imageURL = URL.createObjectURL(response.data);
        setResult(imageURL);
      } catch (error) {
        console.error(error);
        return;
      }
    } else {
      alert("No file selected");
      return;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black items-center">
      <main className="flex min-h-screen w-full flex-col items-center justify-between md:py-20 py-16 px-5 bg-white dark:bg-black sm:items-center">
        <div className=" flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className=" text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Real time ingot counter
          </h1>
        </div>
        <div className="flex md:flex-row flex-col mt-10 mb-5">
          <div className=" mb-5 md:mb-0 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            {image && (
              <Image
                src={URL.createObjectURL(image)}
                alt="Ingot"
                width={400}
                height={600}
              />
            )}
          </div>
          {result && (
            <div className="ml-0 md:ml-10 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
              <Image src={result} alt="Result" width={400} height={600} />
            </div>
          )}
        </div>

        <div className="text-center sm:text-xl md:text-2xl font-bold text-zinc-300 mb-5">
          {image === null ? (
            <p>Select an ingot.</p>
          ) : ingotCount === null ? (
            <p>Detect</p>
          ) : (
            <p>Ingot count: {ingotCount}</p>
          )}
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {/* <input
            type="file"
            accept="image/*"
            placeholder="Select"
            onChange={handleImageChange}
            className="bg-white border border-gray-300 rounded-md p-2 text-zinc-500 w-[160px]"
          /> */}
          <div>
            {/* Hidden real file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom button */}
            <button
              onClick={handleButtonClick}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            >
              Select Image
            </button>
          </div>

          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            onClick={handleDetect}
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Detect
          </button>
        </div>
      </main>
    </div>
  );
}
