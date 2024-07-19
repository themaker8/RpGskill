import React from 'react';

export default function CompletionCard({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-green-600 p-6 rounded-lg shadow-lg transform transition-transform duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-white">Congratulations!</h2>
        <p className="mt-2 text-white">You've reached the milestone of 20,000 points!</p>
      </div>
    </div>
  );
}
