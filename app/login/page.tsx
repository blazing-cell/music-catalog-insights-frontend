"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {

const router = useRouter();


const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);


const handleLogin = async (
    e: FormEvent
) => {

    e.preventDefault();

    setError("");
    setLoading(true);


    try {

        const response =
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            email,
                            password,
                        }),
                }
            );


        if (!response.ok) {

            throw new Error(
                "Invalid email or password"
            );

        }


        const data =
            await response.json();


        // =========================
        // STORE JWT IN LOCAL STORAGE
        // Used for backend API requests
        // =========================

        localStorage.setItem(
            "token",
            data.token
        );


        // =========================
        // STORE JWT IN COOKIE
        // Used by Next.js middleware
        // =========================

        document.cookie =
            `token=${encodeURIComponent(
                data.token
            )}; path=/; max-age=86400; SameSite=Lax`;


        // =========================
        // STORE USER DATA
        // =========================

        const user = {
            id: data.id,
            username: data.username,
            email: data.email,
        };


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        // =========================
        // KEEP THESE FOR COMPATIBILITY
        // =========================

        localStorage.setItem(
            "username",
            data.username
        );

        localStorage.setItem(
            "email",
            data.email
        );


        // =========================
        // REDIRECT USER
        // =========================

        router.push("/");


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        setError(
            error instanceof Error
                ? error.message
                : "Login failed"
        );


    } finally {

        setLoading(false);

    }

};


return (

    <main className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gray-100
        px-4
    ">

        <div className="
            w-full
            max-w-md
            rounded-2xl
            bg-white
            p-8
            shadow-lg
        ">

            <h1 className="
                text-center
                text-3xl
                font-bold
                text-gray-900
            ">
                Welcome Back
            </h1>


            <p className="
                mt-2
                text-center
                text-gray-500
            ">
                Login to access your music library
            </p>


            {error && (

                <div className="
                    mt-4
                    rounded-lg
                    bg-red-100
                    p-3
                    text-sm
                    text-red-700
                ">

                    {error}

                </div>

            )}


            <form
                onSubmit={handleLogin}
                className="
                    mt-6
                    space-y-4
                    text-black
                "
            >

                {/* EMAIL */}

                <div>

                    <label className="
                        mb-1
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Email
                    </label>


                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        placeholder="Enter your email"
                        required
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                    />

                </div>


                {/* PASSWORD */}

                <div>

                    <label className="
                        mb-1
                        block
                        text-sm
                        font-medium
                        text-gray-700
                    ">
                        Password
                    </label>


                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        placeholder="Enter your password"
                        required
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-black
                        "
                    />

                </div>


                {/* FORGOT PASSWORD */}

                <div className="
                    text-right
                ">

                    <Link
                        href="/forgot-password"
                        className="
                            text-sm
                            font-semibold
                            text-gray-600
                            hover:text-black
                        "
                    >
                        Forgot Password?
                    </Link>

                </div>


                {/* LOGIN BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full
                        rounded-lg
                        bg-black
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-gray-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {loading
                        ? "Logging in..."
                        : "Login"}

                </button>

            </form>


            {/* REGISTER */}

            <p className="
                mt-6
                text-center
                text-sm
                text-gray-600
            ">

                Don't have an account?{" "}

                <Link
                    href="/register"
                    className="
                        font-semibold
                        text-black
                        hover:underline
                    "
                >
                    Create Account
                </Link>

            </p>

        </div>

    </main>

);


}
