"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
User,
Library,
Search,
BarChart3,
Sparkles,
Settings,
LogOut,
LogIn,
X,
Music2,
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
const pathname = usePathname();

const [user, setUser] = useState<UserData>({});


// =========================
// LOAD USER
// =========================

useEffect(() => {

    const loadUser = () => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            setUser({});
            return;
        }

        try {

            const parsedUser =
                JSON.parse(storedUser);

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
// AUTH STATE
// =========================

const isLoggedIn = Boolean(
    user.username
);


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


// =========================
// AUTH BUTTON HANDLER
// =========================

function handleAuthAction() {

    if (isLoggedIn) {
        handleLogout();
        return;
    }

    if (onClose) {
        onClose();
    }

    router.push("/login");

}


// =========================
// NAVIGATION ITEMS
// =========================

const navigationItems = [
    {
        name: "Search",
        path: "/",
        icon: Search,
    },
    {
        name: "My Library",
        path: "/library",
        icon: Library,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: BarChart3,
    },
    {
        name: "AI Insights",
        path: "/ai",
        icon: Sparkles,
    },
    {
        name: "Profile",
        path: "/profile",
        icon: User,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: Settings,
    },
];


return (
    <>

        {/* =========================
            MOBILE OVERLAY
        ========================== */}

        {mobileOpen && (
            <div
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    z-40
                    bg-black/60
                    backdrop-blur-sm
                    lg:hidden
                "
            />
        )}


        {/* =========================
            SIDEBAR
        ========================== */}

        <aside
            className={`
                fixed
                inset-y-0
                left-0
                z-50

                flex
                w-[280px]
                flex-col

                border-r
                border-slate-800

                bg-slate-950

                shadow-2xl

                transition-transform
                duration-300
                ease-in-out

                ${
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }

                lg:static
                lg:h-screen
                lg:translate-x-0
                lg:shadow-none
                lg:shrink-0
            `}
        >


            {/* =========================
                BRAND HEADER
            ========================== */}

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-slate-800
                    px-5
                    py-5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* LOGO */}

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-500
                            shadow-lg
                            shadow-emerald-500/20
                        "
                    >
                        <Music2
                            size={22}
                            className="text-white"
                        />
                    </div>


                    {/* BRAND NAME */}

                    <div>

                        <h1
                            className="
                                text-lg
                                font-bold
                                tracking-tight
                                text-white
                            "
                        >
                            TuneInsights
                        </h1>

                        <p
                            className="
                                text-xs
                                text-slate-500
                            "
                        >
                            Your music, understood
                        </p>

                    </div>

                </div>


                {/* MOBILE CLOSE */}

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-slate-800
                        hover:text-white
                        lg:hidden
                    "
                >
                    <X size={20} />
                </button>

            </div>


            {/* =========================
                SCROLLABLE CONTENT
                (scrolls on mobile only —
                laptop/desktop stays static,
                no scrollbar)
            ========================== */}

            <div
                className="
                    sidebar-scroll
                    min-h-0
                    flex-1
                    overflow-y-auto
                    lg:overflow-y-visible
                    px-4
                    py-5
                "
            >


                {/* =========================
                    USER CARD
                ========================== */}

                <div
                    className="
                        mb-6
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-900
                        p-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {/* AVATAR */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-emerald-500
                                text-base
                                font-bold
                                text-white
                            "
                        >
                            {user.username
                                ? user.username
                                    .charAt(0)
                                    .toUpperCase()
                                : "G"}
                        </div>


                        {/* USER INFO */}

                        <div className="min-w-0">

                            <p
                                className="
                                    mb-1
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Welcome back
                            </p>

                            <h2
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                            >
                                {user.username ||
                                    "Guest"}
                            </h2>

                        </div>

                    </div>

                </div>


                {/* =========================
                    NAVIGATION LABEL
                ========================== */}

                <p
                    className="
                        mb-3
                        px-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    "
                >
                    Menu
                </p>


                {/* =========================
                    NAVIGATION
                ========================== */}

                <nav
                    className="
                        flex
                        flex-col
                        gap-1
                    "
                >

                    {navigationItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() =>
                                    navigate(item.path)
                                }
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-3

                                    text-left
                                    text-sm
                                    font-medium

                                    transition-all
                                    duration-200

                                    ${
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                    }
                                `}
                            >

                                <Icon
                                    size={19}
                                    className={
                                        isActive
                                            ? "text-emerald-400"
                                            : "text-slate-500"
                                    }
                                />

                                <span>
                                    {item.name}
                                </span>

                            </button>
                        );

                    })}

                </nav>

            </div>


            {/* =========================
                LOGIN / LOGOUT
            ========================== */}

            <div
                className="
                    shrink-0
                    border-t
                    border-slate-800
                    bg-slate-950
                    p-4
                "
            >

                <button
                    type="button"
                    onClick={handleAuthAction}
                    className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3

                        text-sm
                        font-medium

                        transition-all
                        duration-200

                        ${
                            isLoggedIn
                                ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                : "text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                        }
                    `}
                >

                    {isLoggedIn ? (
                        <LogOut size={19} />
                    ) : (
                        <LogIn size={19} />
                    )}

                    <span>
                        {isLoggedIn ? "Logout" : "Login"}
                    </span>

                </button>

            </div>

        </aside>

    </>
);


}