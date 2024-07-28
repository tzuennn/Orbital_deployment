"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";

const HomePage: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const { signup, loginWithGoogle } = auth || {};
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      emailRef.current &&
      passwordRef.current &&
      usernameRef.current &&
      profilePicRef.current &&
      signup
    ) {
      try {
        setError("");
        setLoading(true);
        await signup(
          emailRef.current.value,
          passwordRef.current.value,
          usernameRef.current.value,
          profilePicRef.current.value || ""
        );
        router.push("/home");
      } catch (err: any) {
        // handle specific firebase errors
        if (err.code === "auth/email-already-in-use") {
          setError("The email address is already in use by another account.");
        } else if (err.code === "auth/invalid-email") {
          setError("The email address is not valid.");
        } else if (err.code === "auth/weak-password") {
          setError(
            "The password is too weak. Length should be at least 6 characters."
          );
        } else {
          setError("Failed to create an account");
        }

        // clear the input fields
        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
        if (usernameRef.current) usernameRef.current.value = "";
        if (profilePicRef.current) profilePicRef.current.value = "";

        setShowPopup(true);
      }

      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
        router.push("/home");
      }
    } catch (error) {
      setError("Failed to log in with Google");
      setShowPopup(true);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background-home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-black">Study Sphere</h2>
          <p className="text-lg text-black mb-4">
            Transform Your Study Experience Now
          </p>
          <Link
            href="/login"
            className="bg-black text-white py-2 px-4 rounded inline-block hover:bg-gray-600"
          >
            Enter Study Sphere
          </Link>
        </div>
        <h3 className="text-xl font-bold mb-4 text-black">Create an account</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            ref={emailRef}
            placeholder="Email"
            autoComplete="email"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            placeholder="Password"
            autoComplete="new-password"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            id="username"
            name="username"
            ref={usernameRef}
            placeholder="Username"
            autoComplete="username"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            id="profilePic"
            name="profilePic"
            ref={profilePicRef}
            placeholder="Profile Picture URL (optional)"
            autoComplete="profilePic"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-600"
            type="submit"
            disabled={loading}
          >
            Sign up with email
          </button>
        </form>
        <div className="my-4 text-center text-black">or continue with</div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-black py-2 border border-gray-300 rounded flex items-center justify-center"
        >
          <img
            src="/images/google-icon.png"
            alt="Google"
            className="h-6 mr-2"
          />
          Google
        </button>
        <p className="text-xs text-gray-600 mt-4">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h2 className="text-lg font-semibold text-black mb-4">Error</h2>
            <p>{error}</p>
            <button
              onClick={handleClosePopup}
              className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
