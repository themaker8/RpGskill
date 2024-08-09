'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, increment, getDoc, deleteDoc } from 'firebase/firestore';
import { defaultDb, auth } from '../firebase/config';
import Navbar from '../navbar';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import CompletionCard from './completioncard'; // Import the CompletionCard component

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        fetchSkills(currentUser.uid);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        console.error('User not authenticated');
        router.push('/Home');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to the homepage after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchSkills = async (userId) => {
    try {
      setIsLoading(true);
      const skillsCollectionRef = collection(defaultDb, 'skills');
      const unsubscribe = onSnapshot(skillsCollectionRef, (snapshot) => {
        const skillsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const userSkills = skillsData.filter(skill => skill.userId === userId);
        setSkills(userSkills);
        setTotalScore(userSkills.reduce((total, skill) => total + skill.score, 0));  // Calculate total score
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching skills:', error);
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(defaultDb, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userTotalScore = userData.totalScore || 0;
        const levelHistory = userData.levelHistory || [];
        const milestonesShown = userData.milestonesShown || [];
        setLevel(userData.level || 1);
        setTotalScore(userTotalScore);

        // Check if milestone has been reached and not shown before
        if (userTotalScore >= 20000 && !milestonesShown.includes('20000')) {
          setShowCompletionCard(true);
          // Update milestonesShown field to include the newly achieved milestone
          await updateDoc(userDocRef, {
            milestonesShown: [...milestonesShown, '20000']
          });
        } else {
          setShowCompletionCard(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const increaseScore = async (skillId) => {
    try {
      setIsLoading(true);
      const skillRef = doc(defaultDb, 'skills', skillId);
      await updateDoc(skillRef, {
        score: increment(10)
      });

      const userRef = doc(defaultDb, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const oldTotalScore = userData.totalScore || 0;
      const newTotalScore = oldTotalScore + 10;
      const oldLevel = userData.level || 1;
      const newLevel = calculateLevel(newTotalScore);

      // Update level history
      const levelHistory = userData.levelHistory || [];
      if (newLevel > oldLevel) {
        levelHistory.push({
          level: newLevel,
          score: newTotalScore,
          timestamp: new Date().toISOString()
        });
      }

      await updateDoc(userRef, {
        totalScore: newTotalScore,
        level: newLevel,
        levelHistory: levelHistory
      });

      fetchSkills(user.uid);
      fetchUserData(user.uid);
    } catch (error) {
      console.error('Error increasing score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSkill = async (skillId, skillScore) => {
    try {
      setIsLoading(true);
      await deleteDoc(doc(defaultDb, 'skills', skillId));

      const userRef = doc(defaultDb, 'users', user.uid);
      await updateDoc(userRef, {
        totalScore: increment(-skillScore)
      });

      fetchSkills(user.uid);
      fetchUserData(user.uid);
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (score) => {
    return Math.floor(score / 20000) + 1;
  };

  const getLevelProgressPercentage = (score) => {
    return (score % 20000) / 20000 * 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffbeb] text-black pb-16">
      {user ? (
        <>
          <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto flex-grow">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-body mb-6 text-center">
              Welcome, {user.displayName}
            </h1>

            <div className="mb-8 flex justify-center">
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-center">Total Score</h2>
              <div className="relative w-full bg-[#FF4655] p-4 rounded-lg">
                <div className="relative h-6 bg-black rounded-lg overflow-hidden">
                  <div
                    className="absolute h-6 bg-green-400 rounded-lg"
                    style={{ width: `${Math.min(totalScore, 20000) / 20000 * 100}%`, transition: 'width 0.5s ease-in-out' }}
                  />
                </div>
                <p className="text-center text-xl font-bold mt-2">Total Score: {totalScore}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-center">Your Level</h2>
              <div className="text-center text-xl font-bold mb-4">
                Level: {level}
              </div>
              <div className="relative w-full bg-[#FF4655]  p-2 rounded-lg">
                <div className="relative h-2 bg-black rounded-lg overflow-hidden">
                  <div
                    className="absolute h-2 bg-blue-400 rounded-lg"
                    style={{ width: `${getLevelProgressPercentage(totalScore)}%`, transition: 'width 0.5s ease-in-out' }}
                  />
                </div>
                <p className="text-center text-sm font-semibold mt-1">Score to next level: {20000 - (totalScore % 20000)} points</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Your Skills</h3>
              <ul className="space-y-4">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex flex-col items-start bg-[#FF4655] p-4 rounded-lg shadow-md space-y-2"
                  >
                    <div className="w-full">
                      <span className="font-bold text-xl break-words">{skill.name}</span>
                    </div>
                    <div className="relative w-full">
                      <div className="relative h-2 bg-gray-300 rounded-lg overflow-hidden">
                        <div
                          className="absolute h-2 bg-green-400 rounded-lg"
                          style={{ width: `${Math.min(skill.score, 100)}%`, transition: 'width 0.5s ease-in-out' }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => increaseScore(skill.id)}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {showCompletionCard && <CompletionCard onClose={() => setShowCompletionCard(false)} />}
          <Navbar /> {/* Include the Navbar component */}
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl font-sans">User not authenticated. Please log in.</p>
        </div>
      )}

    </div>
  );
}
