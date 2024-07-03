'use client';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      router.push('/'); // Redirect to the homepage or another route
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded-lg"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
