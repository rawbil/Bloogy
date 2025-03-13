"use client";
import { FaCamera } from "react-icons/fa";
import { EditIcon, MailWarningIcon } from "lucide-react";

import { useContextFunc } from "@/components/context/AppContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { VscWarning } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { userInfo, loadingContext, accessToken } = useContextFunc();
  const [info, setInfo] = useState(false);
  const { data } = useSession();
  const router = useRouter();
  const [name, setName] = useState(userInfo && userInfo?.name || "");
  const [showReadonlyMessage, setShowReadonlyMessage] = useState(false);
  useEffect(() => {
    if (!loadingContext && accessToken === null) {
      router.push("/user/login");
    }
  }, [accessToken, loadingContext]);

  if (loadingContext) {
    return <div>Loading...</div>;
  }

  const handleImageChange = async () => {};

  const submitInfo = async () => {
    setInfo(false)
  }

  return (
    <section className="w-full max-h-screen flex items-center justify-center font-poppins mb-4">
      <div className="dark:bg-slate-800 bg-slate-100 dark:text-white text-slate-900 h-1/2 w-[600px] max-w-[90%] flex flex-col items-center justify-center p-3 mt-4 rounded-md shadow">
        <section className="relative">
          <Image
            src={userInfo?.avatar?.url || data?.user?.image || "/profile.webp"}
            alt="avatar"
            width={30}
            height={30}
            className="w-[100px] h-[100px] max-500:w-[80px] max-500:h-[80px] max-300px:w-[60px] max-300px:h-[60px] rounded-full object-cover"
            unoptimized
            priority
          />

          <input
            type="file"
            name="avatar"
            id="avatar"
            className="hidden"
            accept="image/png, image/jpeg, image/webp, image/jpg, image/svg"
            onChange={handleImageChange}
          />
          <label htmlFor="avatar">
            <div className="dark:bg-slate-800 w-[25px] h-[25px] rounded-full absolute bottom-2 right-2 flex items-center justify-center">
              <FaCamera className="  cursor-pointer" size={20} />
            </div>
          </label>
        </section>
        {/* name and email */}
        {info ? (
          <form onSubmit={submitInfo} className="shadow shadow-slate-900 rounded-md p-2 py-4 w-[90%] max-500:w-full items-center relative mb-4 mt-8 flex flex-col">
            <input type="text" name="name" value={name || userInfo?.name} onChange={(e) => setName(e.target.value)} className=' w-full p-2 bg-transparent shadow shadow-slate-500 rounded-md outline-none' />
            <input type="email" name="email" value={userInfo?.email} readOnly className="mt-[20px] w-full p-2 bg-transparent  rounded-md outline-none border border-crimson" onMouseOver={() => setShowReadonlyMessage(true)} onMouseLeave={() => setShowReadonlyMessage(false)} />
            {showReadonlyMessage && <p className="w-full text-sm text-crimson">email is readOnly!</p>}

            <button type="submit" className="mt-5 bg-[#37a39a] p-2 rounded place-self-end hover:bg-[#37a39a]/80">Update Info</button>
          </form>
        ) : (
          <section className="mt-8 flex flex-col gap-2 dark:shadow border border-slate-500 dark:border-slate-300 rounded-md p-2 py-4 w-[90%] max-500:w-full items-center relative mb-4">
            <p className="font-semibold">{userInfo?.name}</p>
            <hr className="w-[80%] h-[1px] max-500:w-full bg-gray-400 dark:w-0" />
            <p className="dark:text-gray-400 text-gray-700">
              {userInfo?.email}
            </p>
            <div
              className="absolute -bottom-2 right-2 cursor-pointer dark:bg-slate-800 bg-white"
              onClick={() => setInfo(true)}
            >
              <EditIcon size={20} />
            </div>
          </section>
        )}

        <button className="mt-8 flex flex-col gap-2 dark:shadow rounded-md p-2 py-4 w-[90%] max-500:w-full items-center relative mb-4 bg-[#37a39a] hover:opacity-90 transition">
          Update Password
        </button>

        <button className="flex flex-row justify-center gap-2 dark:shadow border-2 border-crimson text-crimson rounded-md p-2 py-4 w-[90%] max-500:w-full items-center relative mb-4 hover:bg-[crimson]/50 transition hover:text-white">
          <span className="place-self-center">Delete Account</span>
          <VscWarning className="absolute left-2" size={25} />
        </button>
      </div>
    </section>
  );
}
