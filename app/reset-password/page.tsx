"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function ResetPassword() {

    const router = useRouter();


    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);



    async function resetPassword() {


        if(!password){

            toast.error(
                "Enter a new password"
            );

            return;

        }



        const token =
            localStorage.getItem(
                "resetToken"
            );



        if(!token){

            toast.error(
                "Invalid reset session"
            );

            router.push(
                "/forgot-password"
            );

            return;

        }



        try {


            setLoading(true);



            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`,
                    {

                        method:"POST",


                        headers:{
                            "Content-Type":
                            "application/json"
                        
                        },


                        body:JSON.stringify({

                            token,

                            password

                        })

                    }
                );



            const data =
                await response.text();



            if(!response.ok){

                throw new Error(data);

            }



            toast.success(
                "Password changed successfully"
            );



            localStorage.removeItem(
                "resetToken"
            );



            router.push(
                "/login"
            );



        }
        catch(error:any){

            toast.error(
                error.message ||
                "Password reset failed"
            );

        }
        finally{

            setLoading(false);

        }


    }




    return (

        <main className="
            min-h-screen
            flex
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
                    text-3xl
                    font-bold
                    text-center
                    text-gray-900
                ">
                    Reset Password
                </h1>



                <p className="
                    mt-2
                    text-center
                    text-gray-500
                ">
                    Enter your new password
                </p>




                <div className="
                    mt-6
                    space-y-4
                ">



                    <input

                        type="password"

                        value={password}

                        onChange={(e)=>
                            setPassword(
                                e.target.value
                            )
                        }

                        placeholder="New password"

                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-3
                            text-black
                            outline-none
                            focus:ring-2
                            focus:ring-black
                        "

                    />



                    <button

                        onClick={resetPassword}

                        disabled={loading}

                        className="
                            w-full
                            rounded-lg
                            bg-black
                            py-3
                            font-semibold
                            text-white
                            hover:bg-gray-800
                            disabled:opacity-50
                        "

                    >

                        {
                            loading
                            ?
                            "Updating..."
                            :
                            "Reset Password"
                        }


                    </button>


                </div>



            </div>


        </main>

    );

}