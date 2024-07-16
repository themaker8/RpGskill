


'use client'
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { defaultDb, auth } from '../firebase/config';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(defaultDb, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setTotalScore(userData.totalScore || 0);
        setLevel(userData.level || 1);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const calculateLevel = (score) => {
    return Math.floor(score / 20000) + 1;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white pb-16">
      <Navbar user={user} />
      {user ? (
        <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto flex-grow">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">Profile</h1>
            <div className="flex flex-col items-center">
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt="User Avatar"
                className="w-32 h-32 rounded-full mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2">{user.displayName}</h2>
              <p className="text-xl mb-4">Email: {user.email}</p>
              <div className="w-full flex flex-col items-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Total Score</h3>
                <div className="relative w-full bg-gray-700 p-4 rounded-lg">
                  <div className="relative h-6 bg-gray-600 rounded-lg overflow-hidden">
                    <div
                      className="absolute h-6 bg-green-400 rounded-lg"
                      style={{ width: `${Math.min(totalScore, 20000) / 20000 * 100}%`, transition: 'width 0.5s ease-in-out' }}
                    />
                  </div>
                  <p className="text-center text-xl font-bold mt-2">Total Score: {totalScore}</p>
                </div>
              </div>
              <div className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Level</h3>
                <div className="text-center text-xl font-bold mb-4">
                  Level: {calculateLevel(totalScore)}
                </div>
                <div className="relative w-full bg-gray-700 p-2 rounded-lg">
                  <div className="relative h-2 bg-gray-600 rounded-lg overflow-hidden">
                    <div
                      className="absolute h-2 bg-blue-400 rounded-lg"
                      style={{ width: `${(totalScore % 20000) / 20000 * 100}%`, transition: 'width 0.5s ease-in-out' }}
                    />
                  </div>
                  <p className="text-center text-sm font-semibold mt-1">
                    Score to next level: {20000 - (totalScore % 20000)} points
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl">User not authenticated. Please log in.</p>
        </div>
      )}
    </div>
  );
}