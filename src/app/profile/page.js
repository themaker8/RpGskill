// pages/profile.js
'use client'
import { useState } from 'react';
import { auth } from '../firebase/config';
import Navbar from '../navbar';
import LogoutButton from '../user/page';// Import the LogoutButton component

export default function Profile() {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');

  const updateProfile = async () => {
    try {
      if (displayName && auth.currentUser) {
        await auth.currentUser.updateProfile({ displayName });
        alert('Profile updated!');
      } else {
        console.error('Display name is empty or user is not authenticated');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto flex-grow">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">
          Profile Page
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter new display name"
            className="border border-gray-300 p-2 rounded-lg mb-2 w-full md:w-3/4 mx-auto"
          />
          <button onClick={updateProfile} className="bg-black text-white py-2 px-4 m-2 rounded-lg">
            Update Profile
          </button>
        </div>
      </div>
      <Navbar /> {/* Include the Navbar component */}
    </div>
  );
}
