// src/middleware.js
import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth";
import { auth } from "./utils/firebase"; // Firebase configuration

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Initialize Firebase Auth
  const auth = getAuth();

  // Get the current user
  const user = auth.currentUser;

  // Protect the dashboard routes by checking if the user is logged in
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      // If not logged in, redirect to the login page
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow the request to proceed if user is authenticated or the route is not protected
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect all routes under /dashboard
};
