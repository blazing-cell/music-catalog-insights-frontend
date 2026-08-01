"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
User,
Library,
Search,
BarChart3,
Sparkles,
Settings,
LogOut,
X,
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
id?: number;
username?: string;
email?: string;
}

interface DashboardProps {
mobileOpen?: boolean;
onClose?: () => void;
}

export default function Dashboard({
mobileOpen = false,
onClose,
}: DashboardProps) {


const router = useRouter();

const [user, setUser] = useState<UserData>({});

// =========================
// LOAD USER
// =========================

useEffect(() => {

    const loadUser = () => {

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            setUser({});
            return;
        }

        try {

            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);

        } catch (error) {

            console.error(
                "Failed to parse user data:",
                error
            );

            setUser({});

        }

    };

    loadUser();

    window.addEventListener(
        "userUpdated",
        loadUser
    );

    return () => {

        window.removeEventListener(
            "userUpdated",
            loadUser
        );

    };

}, []);

// =========================
// NAVIGATION
// =========================

function navigate(path: string) {

    router.push(path);

    if (onClose) {
        onClose();
    }

}

// =========================
// LOGOUT
// =========================

function handleLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    document.cookie =
        "token=; path=/; max-age=0";

    toast.success(
        "Logged out successfully"
    );

    if (onClose) {
        onClose();
    }

    router.push("/login");

}

return (
    <>
        {/* =========================
            MOBILE OVERLAY
        ========================== */}

        {mobileOpen && (
            <div
                onClick={onClose}
                className="
                    fixed inset-0 z-40
                    bg-black/60
                    lg:hidden
                "
            />
        )}

        {/* =========================
            DASHBOARD
        ========================== */}

        <aside
            className={`
                fixed left-0 top-0 z-50
                flex h-screen w-72
                flex-col
                border-r border-slate-800
                bg-slate-900
                shadow-2xl

                transition-transform
                duration-300
                ease-in-out

                ${mobileOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }

                lg:static
                lg:z-auto
                lg:translate-x-0
                lg:shadow-none
                lg:shrink-0
            `}
        >

            {/* =========================
                MOBILE CLOSE BUTTON
            ========================== */}

            <button
                onClick={onClose}
                className="
                    absolute right-4 top-4
                    rounded-lg p-2
                    text-slate-400
                    transition
                    hover:bg-slate-800
                    hover:text-white
                    lg:hidden
                "
            >
                <X size={22} />
            </button>


            {/* =========================
                SCROLLABLE SIDEBAR CONTENT
            ========================== */}

            <div className="
                flex
                min-h-0
                flex-1
                flex-col
                overflow-y-auto
                p-6
            ">

                {/* =========================
                    LOGO
                ========================== */}

                <div className="mb-6">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-emerald-400
                    ">
                        Music Library
                    </h1>

                    <p className="
                        text-sm
                        text-slate-400
                    ">
                        Personal Dashboard
                    </p>

                </div>


                {/* =========================
                    USER
                ========================== */}

                <div className="
                    mb-8
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-800
                    p-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        {/* AVATAR */}

                        <div className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-500
                            text-lg
                            font-bold
                            text-white
                        ">

                            {user.username
                                ? user.username
                                    .charAt(0)
                                    .toUpperCase()
                                : "G"}

                        </div>


                        {/* USERNAME */}

                        <div className="min-w-0">

                            <h2 className="
                                truncate
                                font-semibold
                                text-white
                            ">

                                {user.username ||
                                    "Guest"}

                            </h2>

                        </div>

                    </div>

                </div>


                {/* =========================
                    NAVIGATION
                ========================== */}

                <nav className="
                    flex
                    flex-1
                    flex-col
                    gap-2
                ">

                    {/* SEARCH */}

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            p-3
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-emerald-400
                        "
                    >
                        <Search size={20} />
                        Search
                    </button>


                    {/* LIBRARY */}

                    <button
                        onClick={() =>
                            navigate("/library")
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            p-3
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-emerald-400
                        "
                    >
                        <Library size={20} />
                        My Library
                    </button>


                    {/* ANALYTICS */}

                    <button
                        onClick={() =>
                            navigate("/analytics")
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            p-3
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-emerald-400
                        "
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </button>


                    {/* AI INSIGHTS */}

                    <button
                        onClick={() =>
                            navigate("/ai")
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            p-3
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-emerald-400
                        "
                    >
                        <Sparkles size={20} />
                        AI Insights
                    </button>


                    {/* PROFILE */}

                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            p-3
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-emerald-400
                        "
                    >
                        <User size={20} />
                        Profile
                    </button>


                    {/* SETTINGS */}

                    <button
                        onClick={() =>
                            navigate("/settings")
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            p-3
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-emerald-400
                        "
                    >
                        <Settings size={20} />
                        Settings
                    </button>

                </nav>

            </div>


            {/* =========================
                LOGOUT
            ========================== */}

            <div className="
                shrink-0
                border-t
                border-slate-800
                bg-slate-900
                p-6
            ">

                <button
                    onClick={handleLogout}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        p-3
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700
                    "
                >

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>
    </>
);


}
