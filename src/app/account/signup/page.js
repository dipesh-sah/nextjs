"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "@/app/account/signup/Signup.css";
import { app, db } from "@/firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/account");
      }
    });
    return () => unSubscribe();
  }, [auth, router]);

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "User", user.uid), {
        username,
        email: user.email,
        createdAt: new Date(),
      });

      toast.success(`Account created successfully! Welcome, ${username}`);
      router.push("/account");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container">
      <div className="signup_section">
        <h2>Sign up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        <ToastContainer />
        <p>
          Already have an account? <Link href="/account/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
