"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaX } from "react-icons/fa6";

export default function Login() {
  const router = useRouter();
  return (
    <form className="bg-green w-[450px] max-w-full mx-auto p-2 rounded mt-[100px] font-josefin shadow dark:shadow-white shadow-black">
      <h2 className="mb-5 flex justify-between w-full items-center ">
        <span className="font-[500] text-[24px] uppercase">Login</span>
        <span className="cursor-pointer hover:text-white/50" onClick={() => router.back()}>
          <FaX />
        </span>
      </h2>
      <div className="flex flex-col mb-5">
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="rounded p-2 outline-none bg-white"
        />
      </div>

      {/* password */}
      <div className="flex flex-col mb-7">
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="rounded p-2 outline-none bg-white"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white grid mx-auto p-1.5 w-full rounded hover:bg-black/80 transition hover:text-white/80 "
      >
        Login
      </button>

      <div className="flex items-center justify-between mt-7 uppercase gap-[10px]">
        <hr className="h-[1px] w-full" />
        <h1>or</h1>
        <hr className="h-[1px] w-full" />
      </div>

      <div className="flex items-center justify-center gap-[10%] mt-5 w-full">
        <span className="cursor-pointer bg-gray-800 shadow shadow-white rounded-full animation hover:animate-pulse  ">
          <FcGoogle size={40} />
        </span>
        <span className="cursor-pointer text-gray-800 rounded-full shadow shadow-white animation hover:animate-pulse ">
          <FaGithub size={40} />
        </span>
      </div>

      <p className="mt-6 mb-1 text-center">
        Don't have an account?{" "}
        <span
          className="cursor-pointer text-blue-700 underline hover:no-underline"
          onClick={() => router.push("/register")}
        >
          Register
        </span>
      </p>
    </form>
  );
}
