import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(
request: NextRequest
) {


const token =
    request.cookies.get("token")?.value;

const pathname =
    request.nextUrl.pathname;


// =========================
// PROTECTED ROUTES
// =========================

const protectedRoutes = [
    "/profile",
    "/settings",
    "/analytics",
    "/library",
    "/ai",
];


const isProtectedRoute =
    protectedRoutes.some(
        (route) =>
            pathname.startsWith(route)
    );


// =========================
// AUTH ROUTES
// =========================

const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register";


// =========================
// PROTECTED ROUTE
// USER IS NOT LOGGED IN
// =========================

if (
    isProtectedRoute &&
    !token
) {

    const loginUrl =
        new URL(
            "/login",
            request.url
        );


    // Remember requested page

    loginUrl.searchParams.set(
        "redirect",
        pathname
    );


    return NextResponse.redirect(
        loginUrl
    );

}


// =========================
// AUTH ROUTE
// USER IS ALREADY LOGGED IN
// =========================

if (
    isAuthRoute &&
    token
) {

    return NextResponse.redirect(
        new URL(
            "/",
            request.url
        )
    );

}


// =========================
// ALLOW REQUEST
// =========================

return NextResponse.next();


}

export const config = {


matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/library/:path*",
    "/ai/:path*",
    "/login",
    "/register",
],


};
