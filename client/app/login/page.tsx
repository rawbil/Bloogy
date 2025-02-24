"use client";

import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
  return (
    <form className="bg-green w-[450px] max-w-full mx-auto p-2 rounded mt-[100px] font-josefin">
      <h2 className="text-center mb-5 font-[500] text-[24px] uppercase">
        Login
      </h2>
      <div className="flex flex-col mb-5">
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="rounded p-2 outline-none"
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
          className="rounded p-2 outline-none"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white grid mx-auto p-1.5 w-full rounded hover:bg-black/80 transition hover:text-white/80 "
      >
        Login
      </button>

      <p className="mt-4 text-center">
        Don't have an account? <span className="cursor-pointer text-blue-700 underline hover:no-underline" onClick={() => router.push('/register')}>Register</span>
      </p>
    </form>
  );
}
