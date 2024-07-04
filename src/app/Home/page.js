'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, doc, increment, FieldValue} from 'firebase/firestore';
import { defaultDb, auth } from '../firebase/config';
import LogoutButton from '../user/page'; // Correct import path for LogoutButton

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
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
      console.log('Fetching skills for user UID:', userId);  // Log UID for debugging
      const skillsCollectionRef = collection(defaultDb, 'skills');  // Get a reference to the 'skills' collection
      const unsubscribe = onSnapshot(skillsCollectionRef, (snapshot) => {
        console.log('Snapshot data:', snapshot.docs.map(doc => doc.data()));  // Log the data fetched
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

  const addSkill = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      if (newSkill) {
        await addDoc(collection(defaultDb, 'skills'), {
          name: newSkill,  // Skill name
          userId: user.uid,
          score: 0  // Initialize score to 0
        });
        setNewSkill('');
        fetchSkills(user.uid);
      } else {
        console.error('Skill name is empty');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseScore = async (skillId) => {
    try {
      setIsLoading(true);
      const skillRef = doc(defaultDb, 'skills', skillId);
      await updateDoc(skillRef, {
        score: increment(10)  // Increase the score by 1
      });
      fetchSkills(user.uid);
    } catch (error) {
      console.error('Error increasing score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">
        {user ? user.displayName : 'User'}
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter new skill"
          className="border border-gray-300 p-2 rounded-lg mb-2 w-full md:w-3/4 mx-auto"
        />
        <button onClick={addSkill} className="bg-black text-white py-2 px-4 m-2 rounded-lg">
          Add Skill
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      <div>
        <h3 className="text-xl font-semibold mb-2">Your Skills</h3>
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
                      style={{ width: `${Math.min(skill.score, 100)}%`, transition: 'width 0.5s ease-in-out' }}  // Adjust score scaling to a percentage width with animation
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center">
        <LogoutButton /> {/* Include the LogoutButton component */}
      </div>
    </div>
  );
}