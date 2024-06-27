'use client';
import { useEffect } from 'react';
import { auth } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        // Redirect to dashboard or another page
        // Example: Router.push('/dashboard');
      } else {
        console.log('No user signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Handle successful sign-in here, e.g., redirect or update UI state
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle error, e.g., show error message to user
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-black text-2xl">Level up your skills in a place that feels like an RPG!</h1>
      <br/>
      <div className="flex flex-row md:flex-row mb-4">
        <button className="bg-black text-white py-2 px-4 m-2 md:m-0 md:mx-2 rounded-lg" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}