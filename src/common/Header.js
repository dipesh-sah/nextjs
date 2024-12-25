"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Logo from '../../public/assets/nepalekart_white.png'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/app'
const Header = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.email)
      }
    });
    return () => unSubscribe();
  }, []);
  return (
    <div className="container">
      <nav>
        <div className="logo">
          <Image src={Logo} alt='Logo' />
        </div>
        <div className="nav-link">
          <Link href={'/'}>Recharge and Bill Payment</Link>
          {user ? <p>{user}</p> : <Link href={'/account'}>Login / Sign up </Link>}<span><i className="fa-solid fa-user"></i></span>
        </div>
      </nav>
    </div>
  )
}

export default Header