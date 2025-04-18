"use client"

import { useContextFunc } from "@/components/context/AppContext"
import { useEffect } from "react";

export default function AdminClientLayout() {
    const {userInfo} = useContextFunc();
    useEffect(() => {
        if(userInfo && userInfo.email) {
            document.title = `Admin-${userInfo.email}`;
        }
        else {
            document.title = "Admin Bloogy";
        }
    }, [userInfo])
    return null
}