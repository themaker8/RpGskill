'use client';

import { useEffect, useState } from 'react';
import { auth } from './firebase/config'; // Make sure the import path is correct
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import LogoutButton from './user/page';// Ensure the correct path to LogoutButton component

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        router.push('/Home'); // Redirect to the skills page if the user is logged in
        setUser(user);
      } else {
        console.log('No user signed in');
        router.push('/');  // Redirect to the homepage or another route if the user is not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-black text-2xl">Level up your skills in a place that feels like an RPG!</h1>
      <br />
      {user ? (
        <>
          <p className="text-black text-xl mb-4">Welcome, {user.displayName}!</p>
          <LogoutButton /> {/* This button handles logging out */}
        </>
      ) : (
        <div className="flex flex-row md:flex-row mb-4">
          <button
            className="bg-black text-white py-2 px-4 m-2 md:m-0 md:mx-2 rounded-lg"
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
