'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { defaultDb, auth } from '../firebase/config';
import Navbar from '../navbar';
import LogoutButton from '../user/page';

export default function AddSkill() {
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');

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
      const skillsSnapshot = await getDocs(skillsCollectionRef);
      const skillsData = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(skillsData.filter(skill => skill.userId === userId));
      setIsLoading(false);
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
          name: newSkill,
          userId: user.uid,
          score: 0
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

  const deleteSkill = async () => {
    if (!selectedSkillId) {
      console.error('No skill selected for deletion');
      return;
    }

    try {
      setIsLoading(true);
      await deleteDoc(doc(defaultDb, 'skills', selectedSkillId));
      setSelectedSkillId('');
      fetchSkills(user.uid);
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto flex-grow">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">
          Add New Skill
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

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-center">All Skills</h2>
          <div className="border border-gray-300 p-4 rounded-lg space-y-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-100 transition-transform duration-300 ease-in-out ${selectedSkillId === skill.id ? 'bg-blue-100 transform scale-105' : ''}`}
                onClick={() => setSelectedSkillId(skill.id === selectedSkillId ? '' : skill.id)}
              >
                <span>{skill.name}</span>
                {selectedSkillId === skill.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSkillId(skill.id);
                    }}
                    className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600"
                  >
                    Select for Deletion
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-center">Delete Skill</h2>
          <button
            onClick={deleteSkill}
            className="bg-red-500 text-white py-2 px-4 m-2 rounded-lg w-full md:w-3/4 mx-auto"
            disabled={!selectedSkillId || isLoading}
          >
            Delete
          </button>
        </div>
        {isLoading && <p className="text-center">Loading...</p>}
      </div>
      <div className="text-center mb-4">
        <LogoutButton />
      </div>
      <Navbar />
    </div>
  );
}
