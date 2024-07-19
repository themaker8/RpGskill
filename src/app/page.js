'use client';

import { useEffect, useState } from 'react';
import { auth, defaultDb } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import LogoutButton from './user/page'; // Ensure the correct path
import { useRouter } from 'next/navigation';
export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push('/Home'); // Redirect to the Home page

        // Check and set user data in Firestore
        await handleUserDocument(currentUser);
      } else {
        router.push('/'); // Redirect to the homepage
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Handle user document creation or update
      await handleUserDocument(user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleUserDocument = async (user) => {
    const userDocRef = doc(defaultDb, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        totalScore: 0,
        level: 1,
        levelHistory: [],
        milestonesShown: [],
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } else {
      // Optionally update the document with new info if needed
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }, { merge: true });
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
