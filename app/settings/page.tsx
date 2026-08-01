"use client";

import { useState } from "react";
import Dashboard from "@/app/components/dashboard";
import { LogOut, Moon, Info, Shield, Menu } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function Settings() {

    const router = useRouter();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);



    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");


        toast.success(
            "Logged out successfully"
        );


        router.push("/login");

    };



    return (

        <div className="
            flex h-dvh overflow-hidden
            bg-slate-950 text-white
        ">

            <Dashboard
                mobileOpen={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
            />

            <main className="
                min-w-0 flex-1 overflow-y-auto
                px-4 py-6 sm:px-6 sm:py-8 lg:px-10
            ">


                <div className="
                    mx-auto max-w-4xl
                ">

                    {/* MOBILE TOP BAR */}

                    <div className="
                        mb-4 flex items-center justify-between lg:hidden
                    ">

                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="
                                flex items-center gap-2 rounded-lg
                                border border-slate-800 bg-slate-900
                                p-2.5 text-slate-300 transition
                                hover:border-slate-700 hover:text-emerald-400
                            "
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>

                        <span className="text-sm font-semibold text-emerald-400">
                            Settings
                        </span>

                        <div className="w-[41px]" />

                    </div>


                    <h1 className="
                        mb-6 hidden text-3xl font-bold lg:block
                    ">
                        Settings
                    </h1>




                    <div className="
                        space-y-4
                    ">



                        {/* Theme */}

                        <div className="
                            rounded-xl
                            border border-slate-800
                            bg-slate-900
                            p-5
                        ">


                            <div className="
                                flex items-center gap-3
                            ">


                                <Moon
                                    className="
                                        shrink-0 text-emerald-400
                                    "
                                />


                                <div>


                                    <h2 className="
                                        font-semibold
                                    ">
                                        Theme
                                    </h2>


                                    <p className="
                                        text-sm text-slate-400
                                    ">
                                        Dark mode enabled
                                    </p>


                                </div>


                            </div>


                        </div>







                        {/* Security */}

                        <div className="
                            rounded-xl
                            border border-slate-800
                            bg-slate-900
                            p-5
                        ">


                            <div className="
                                flex items-center gap-3
                            ">


                                <Shield
                                    className="
                                        shrink-0 text-emerald-400
                                    "
                                />


                                <div>


                                    <h2 className="
                                        font-semibold
                                    ">
                                        Security
                                    </h2>


                                    <p className="
                                        text-sm text-slate-400
                                    ">
                                        Account secured with JWT authentication
                                    </p>


                                </div>


                            </div>


                        </div>







                        {/* About */}

                        <div className="
                            rounded-xl
                            border border-slate-800
                            bg-slate-900
                            p-5
                        ">


                            <div className="
                                flex items-center gap-3
                            ">


                                <Info
                                    className="
                                        shrink-0 text-emerald-400
                                    "
                                />


                                <div>


                                    <h2 className="
                                        font-semibold
                                    ">
                                        About
                                    </h2>


                                    <p className="
                                        text-sm text-slate-400
                                    ">
                                        Music Analytics Platform
                                    </p>


                                    <p className="
                                        text-sm text-slate-500
                                    ">
                                        Version 1.0
                                    </p>


                                </div>


                            </div>


                        </div>







                        {/* Logout */}

                        <button
                            onClick={logout}
                            className="
                                flex w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-500
                                py-3
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-400
                            "
                        >

                            <LogOut size={18}/>

                            Logout

                        </button>



                    </div>


                </div>


            </main>

        </div>

    );

}