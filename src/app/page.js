"use client";
import Header from "@/common/Header";
import "@/app/globals.css";
import Category from "@/common/Category";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/app";
import Spinner from "@/common/Spinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });

    return () => unSubscribe();
  }, []);

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <>
      <Header />
      <Category />
    </>
  );
}
