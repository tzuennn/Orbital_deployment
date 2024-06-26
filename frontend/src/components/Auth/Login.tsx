"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login, loginWithGoogle } = useAuth()!;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current && passwordRef.current) {
      try {
        setError("");
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        router.push("/home");
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          setError("No user found with this email address.");
        } else if (err.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else if (err.code === "auth/invalid-email") {
          setError("The email address is not valid.");
        } else {
          setError("Failed to log in. Please check your email and password.");
        }

        // clear the input fields
        if (emailRef.current) emailRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";

        setShowPopup(true);
        console.error("Error logging in:", err);
      }

      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      router.push("/todos");
    } catch (err) {
      setError("Failed to log in with Google");
      setShowPopup(true);
      console.error("Failed to log in with Google", err);
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
            Welcome Back to Study Sphere
          </p>
        </div>
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
            autoComplete="current-password"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Login
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
          Don&apos;t have an account?{" "}
          <a href="/" className="underline">
            Sign up here
          </a>
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

export default Login;
