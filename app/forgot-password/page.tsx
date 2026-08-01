"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function ForgotPassword() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);



    async function sendRequest() {


        if (!email) {

            toast.error(
                "Enter your email"
            );

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );



            const data =
                await response.text();



            if (!response.ok) {

                throw new Error(data);

            }



            // Backend returns:
            // Reset token: xxxxx

            const token =
                data.replace(
                    "Reset token: ",
                    ""
                );



            localStorage.setItem(
                "resetToken",
                token
            );



            toast.success(
                "Reset token generated"
            );



            router.push(
                "/reset-password"
            );



        }
        catch(error:any) {


            toast.error(
                error.message ||
                "Something went wrong"
            );


        }
        finally {

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
                    text-center
                    text-3xl
                    font-bold
                    text-gray-900
                ">
                    Forgot Password
                </h1>



                <p className="
                    mt-2
                    text-center
                    text-gray-500
                ">
                    Enter your registered email
                </p>




                <div className="
                    mt-6
                    space-y-4
                ">


                    <input

                        type="email"

                        value={email}

                        onChange={(e)=>
                            setEmail(
                                e.target.value
                            )
                        }

                        placeholder="Email address"

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

                        onClick={sendRequest}

                        disabled={loading}

                        className="
                            w-full
                            rounded-lg
                            bg-black
                            py-3
                            font-semibold
                            text-white
                            hover:bg-gray-800
                        "

                    >

                        {
                            loading
                            ?
                            "Sending..."
                            :
                            "Continue"
                        }


                    </button>


                </div>


            </div>


        </main>

    );

}