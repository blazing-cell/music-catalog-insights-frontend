"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/app/components/dashboard";
import { User, Mail, Music, Edit, Menu } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
id: number;
username: string;
email: string;
}

export default function Profile() {


const router = useRouter();

const [user, setUser] =
    useState<UserProfile | null>(null);

const [loading, setLoading] =
    useState(true);

const [editing, setEditing] =
    useState(false);

const [formData, setFormData] = useState({
    username: "",
    email: ""
});

const [mobileNavOpen, setMobileNavOpen] =
    useState(false);


// =========================
// FETCH PROFILE
// =========================

const fetchProfile = async () => {

    try {

        const token =
            localStorage.getItem("token");

        if (!token) {

            toast.error(
                "Please login again"
            );

            router.push("/login");

            return;
        }


        const response =
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            localStorage.removeItem("token");

            toast.error(
                "Session expired. Please login again."
            );

            router.push("/login");

            return;
        }


        if (response.status === 403) {

            toast.error(
                "You are not authorized to access this profile."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                `Failed to fetch profile: ${response.status}`
            );

        }


        const data:
            UserProfile =
            await response.json();


        setUser(data);


        setFormData({
            username:
                data.username || "",

            email:
                data.email || ""
        });


        // Keep local storage synchronized
        localStorage.setItem(
            "user",
            JSON.stringify(data)
        );


    } catch (error) {

        console.error(
            "Profile fetch error:",
            error
        );

        toast.error(
            "Unable to load profile"
        );

    } finally {

        setLoading(false);

    }

};


// =========================
// LOAD PROFILE
// =========================

useEffect(() => {

    fetchProfile();

}, []);


// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async () => {

    try {

        const token =
            localStorage.getItem("token");


        if (!token) {

            toast.error(
                "Please login again"
            );

            router.push("/login");

            return;
        }


        if (!user) {

            toast.error(
                "User profile not found"
            );

            return;
        }


        // Store old email
        const oldEmail =
            user.email;


        // Check if email changed
        const emailChanged =
            formData.email.trim() !== oldEmail;


        const response =
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/update/${encodeURIComponent(oldEmail)}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            username:
                                formData.username.trim(),

                            email:
                                formData.email.trim()
                        })
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "token"
            );

            toast.error(
                "Session expired. Please login again."
            );

            router.push("/login");

            return;
        }


        if (response.status === 403) {

            toast.error(
                "You are not authorized to update this profile."
            );

            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Update response:",
                errorText
            );

            throw new Error(
                `Update failed: ${response.status}`
            );

        }


        // =========================
        // UPDATED USER
        // =========================

        const updatedUser:
            UserProfile = {
                ...user,

                username:
                    formData.username.trim(),

                email:
                    formData.email.trim()
            };


        // =========================
        // UPDATE PROFILE UI
        // =========================

        setUser(
            updatedUser
        );


        // =========================
        // UPDATE LOCAL STORAGE
        // =========================

        localStorage.setItem(
            "user",
            JSON.stringify(
                updatedUser
            )
        );


        // =========================
        // UPDATE DASHBOARD
        // =========================

        window.dispatchEvent(
            new Event(
                "userUpdated"
            )
        );


        // =========================
        // CLOSE EDIT MODE
        // =========================

        setEditing(
            false
        );


        // =========================
        // EMAIL CHANGED
        // =========================

        if (emailChanged) {

            toast.success(
                "Email updated successfully. Please login again."
            );


            // The JWT still contains
            // the old email.
            //
            // Therefore remove the
            // old JWT and login again
            // with the new email.

            localStorage.removeItem(
                "token"
            );


            setTimeout(() => {

                router.push(
                    "/login"
                );

            }, 1500);


            return;
        }


        // =========================
        // ONLY USERNAME CHANGED
        // =========================

        toast.success(
            "Profile updated successfully"
        );


    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );

        toast.error(
            "Failed to update profile"
        );

    }

};


// =========================
// LOADING
// =========================

if (loading) {

    return (

        <div className="
            flex
            h-dvh
            items-center
            justify-center
            bg-slate-950
            text-white
        ">

            Loading profile...

        </div>

    );

}


// =========================
// UI
// =========================

return (

    <div className="
        flex
        h-dvh
        overflow-hidden
        bg-slate-950
        text-white
    ">

        <Dashboard
            mobileOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
        />

        <main className="
            min-w-0
            flex-1
            overflow-y-auto
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-10
        ">


            <div className="
                mx-auto
                max-w-4xl
            ">

                {/* MOBILE TOP BAR */}

                <div className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    lg:hidden
                ">

                    <button
                        onClick={() =>
                            setMobileNavOpen(true)
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-800
                            bg-slate-900
                            p-2.5
                            text-slate-300
                            transition
                            hover:border-slate-700
                            hover:text-emerald-400
                        "
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>

                    <span className="
                        text-sm
                        font-semibold
                        text-emerald-400
                    ">
                        Profile
                    </span>

                    <div className="w-[41px]" />

                </div>


                <h1 className="
                    mb-6
                    hidden
                    text-3xl
                    font-bold
                    lg:block
                ">

                    Profile

                </h1>


                <div className="
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-4
                    shadow-lg
                    sm:p-6
                ">


                    {/* PROFILE HEADER */}

                    <div className="
                        flex
                        flex-col
                        items-center
                        gap-4
                    ">


                        <div className="
                            flex
                            h-24
                            w-24
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-500/20
                        ">

                            <User
                                size={45}
                                className="
                                    text-emerald-400
                                "
                            />

                        </div>


                        <h2 className="
                            break-all
                            text-center
                            text-2xl
                            font-bold
                        ">

                            {user?.username}

                        </h2>


                        <p className="
                            text-slate-400
                        ">

                            Music Analytics User

                        </p>


                    </div>


                    {/* EDIT MODE */}

                    {editing ? (

                        <div className="
                            mt-8
                            space-y-4
                        ">


                            <input
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-950
                                    p-3
                                    text-white
                                    outline-none
                                    focus:border-emerald-500
                                "
                                value={
                                    formData.username
                                }
                                placeholder="Username"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,

                                        username:
                                            e.target.value
                                    })
                                }
                            />


                            <input
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-950
                                    p-3
                                    text-white
                                    outline-none
                                    focus:border-emerald-500
                                "
                                value={
                                    formData.email
                                }
                                placeholder="Email"
                                type="email"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,

                                        email:
                                            e.target.value
                                    })
                                }
                            />


                            <div className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            ">


                                <button
                                    onClick={
                                        updateProfile
                                    }
                                    className="
                                        flex-1
                                        rounded-lg
                                        bg-emerald-500
                                        py-3
                                        font-semibold
                                        text-black
                                        hover:bg-emerald-400
                                    "
                                >

                                    Save Changes

                                </button>


                                <button
                                    onClick={() =>
                                        setEditing(
                                            false
                                        )
                                    }
                                    className="
                                        flex-1
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-800
                                        py-3
                                        font-semibold
                                        hover:bg-slate-700
                                    "
                                >

                                    Cancel

                                </button>


                            </div>


                        </div>

                    ) : (

                        <>


                            {/* PROFILE INFORMATION */}

                            <div className="
                                mt-8
                                grid
                                gap-4
                                sm:grid-cols-2
                            ">


                                <div className="
                                    rounded-lg
                                    border
                                    border-slate-800
                                    bg-slate-950
                                    p-4
                                ">


                                    <div className="
                                        flex
                                        gap-3
                                    ">


                                        <Mail
                                            className="
                                                shrink-0
                                                text-emerald-400
                                            "
                                        />


                                        <div className="min-w-0">


                                            <p className="
                                                text-sm
                                                text-slate-400
                                            ">

                                                Email

                                            </p>


                                            <p className="truncate">

                                                {user?.email}

                                            </p>


                                        </div>


                                    </div>


                                </div>


                                <div className="
                                    rounded-lg
                                    border
                                    border-slate-800
                                    bg-slate-950
                                    p-4
                                ">


                                    <div className="
                                        flex
                                        gap-3
                                    ">


                                        <Music
                                            className="
                                                shrink-0
                                                text-emerald-400
                                            "
                                        />


                                        <div>


                                            <p className="
                                                text-sm
                                                text-slate-400
                                            ">

                                                Library

                                            </p>


                                            <p>

                                                Your music collection

                                            </p>


                                        </div>


                                    </div>


                                </div>


                            </div>


                            {/* EDIT BUTTON */}

                            <button
                                onClick={() =>
                                    setEditing(
                                        true
                                    )
                                }
                                className="
                                    mt-8
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    bg-emerald-500
                                    py-3
                                    font-semibold
                                    text-black
                                    hover:bg-emerald-400
                                "
                            >

                                <Edit
                                    size={18}
                                />

                                Edit Profile

                            </button>


                        </>

                    )}


                </div>


            </div>


        </main>

    </div>

);


}