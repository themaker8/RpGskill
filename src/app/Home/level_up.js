// components/LevelUpCard.js
import React from 'react';

export default function LevelUpCard({ level, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p className="text-lg mb-4">You've reached level {level}!</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
