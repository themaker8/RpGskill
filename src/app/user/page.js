'use client';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/Home'); // Redirect to the homepage after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-lg"
    >
      Logout
    </button>
  );
}
