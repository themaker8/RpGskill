'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { defaultDb, auth } from '../firebase/config';
import LogoutButton from '../user/page';
import Navbar from '../navbar';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        fetchSkills(currentUser.uid);
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
        setSkills(skillsData.filter(skill => skill.userId === userId));
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching skills:', error);
      setIsLoading(false);
    }
  };

  const increaseScore = async (skillId) => {
    try {
      setIsLoading(true);
      const skillRef = doc(defaultDb, 'skills', skillId);
      await updateDoc(skillRef, {
        score: increment(10)
      });
      fetchSkills(user.uid);
    } catch (error) {
      console.error('Error increasing score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16"> {/* Added pb-16 to avoid overlap */}
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto flex-grow">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">
          {user ? `Welcome, ${user.displayName}` : 'Welcome'}
          <br></br>
        </h1>
        <br></br>
  
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Skills</h3>
          <br></br>
          <ul>
            {skills.map((skill) => (
              <li key={skill.id} className="border p-2 my-2 bg-gray-100 rounded-lg flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 mb-2 md:mb-0">
                  <span className="font-bold">{skill.name}</span>
                </div>
                <button 
                  onClick={() => increaseScore(skill.id)}
                  className="bg-green-500 text-white py-1 px-2 rounded-lg ml-2"
                >
                  Increase Score
                </button>
                <div className="w-full md:w-3/4 lg:w-1/2 mt-2">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
                        Score: {skill.score}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-lg">
                      <div
                        className="h-2 bg-green-400 rounded-lg"
                        style={{ width: `${Math.min(skill.score, 100)}%`, transition: 'width 0.5s ease-in-out' }}
                      />
                    </div>
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
