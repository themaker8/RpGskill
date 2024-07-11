'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { defaultDb, auth } from '../firebase/config';
import Navbar from '../navbar';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        fetchSkills(currentUser.uid);
        fetchUserData(currentUser.uid);
      } else {
        console.error('User not authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

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
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setLevel(userData.level || 1);
        setTotalScore(userData.totalScore || 0);
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
      await updateDoc(userRef, {
        totalScore: increment(10)
      });

      fetchSkills(user.uid);
      fetchUserData(user.uid);
    } catch (error) {
      console.error('Error increasing score:', error);
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

  const getRandomSkillBarColor = () => {
    const colors = ['bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-yellow-400'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white pb-16">
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto flex-grow">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
          {user ? `Welcome, ${user.displayName}` : 'Welcome to Your RPG Adventure!'}
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-center">Total Score</h2>
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

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-center">Your Level</h2>
          <div className="text-center text-xl font-bold mb-4">
            Level: {level}
          </div>
          <div className="relative w-full bg-gray-700 p-2 rounded-lg">
            <div className="relative h-2 bg-gray-600 rounded-lg overflow-hidden">
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
              <li key={skill.id} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex-1">
                  <span className="font-bold text-xl">{skill.name}</span>
                </div>
                <button 
                  onClick={() => increaseScore(skill.id)}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                >
                  +
                </button>
                <div className="w-1/2">
                  <div className={`relative h-2 rounded-lg ${getRandomSkillBarColor()}`}>
                    <div
                      className={`absolute h-2 rounded-lg ${getRandomSkillBarColor()}`}
                      style={{ width: `${Math.min(skill.score, 100)}%`, transition: 'width 0.5s ease-in-out' }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Navbar /> {/* Include the Navbar component */}
    </div>
  );
}
