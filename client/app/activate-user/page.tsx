"use client";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-hot-toast";

export default function ActivateUser() {
  const [otp, setOtp] = useState("");

  const handleChange = (e: any) => {
    const value = e.target.value;
    setOtp(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const testValue = /^\d{0,4}$/;
    if (testValue.test(otp) && otp !== "") {
      toast.success("Otp success!");
    } else {
      toast.error("Invalid otp format");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="enter the 4-digit code"
        value={otp}
        onChange={handleChange}
      />
      <button type="submit">submit</button>
    </form>
  );
}
