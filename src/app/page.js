'use client';
import { useEffect, useState } from 'react';
import { auth } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import LogoutButton from './user/page';// Import the new LogoutButton component

export default function Home({ onUserChange }) {
  const router = useRouter(); // Initialize useRouter at the top level of the component
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        router.push('/Home');
        console.log(user.displayName) // Ensure the path starts with '/'
        setUser(user);
        if (onUserChange) onUserChange(user); // Call onUserChange if it's provided
      } else {
        console.log('No user signed in');
        router.push('/'); // Redirect to the homepage or another route
        if (onUserChange) onUserChange(null); // Notify parent component that the user has logged out
      }
    });

    return () => unsubscribe();
  }, [router, onUserChange]); // Ensure onUserChange is in the dependency array

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
      <br />
      {user ? (
        <>
          <p className="text-black text-xl mb-4">Welcome, {user.displayName}!</p>
          <LogoutButton />
        </>
      ) : (
        <div className="flex flex-row md:flex-row mb-4">
          <button className="bg-black text-white py-2 px-4 m-2 md:m-0 md:mx-2 rounded-lg" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
