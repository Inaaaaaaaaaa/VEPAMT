import React, { useState } from 'react';

export default function Step2() {
  const [participants, setParticipants] = useState([{ name: '' }]);

  const handleParticipantChange = (index, event) => {
    const newParticipants = participants.slice();
    newParticipants[index].name = event.target.value;
    setParticipants(newParticipants);
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: '' }]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Participant Information</h2>
      {participants.map((participant, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Participant {index + 1}</label>
          <input
            type="text"
            value={participant.name}
            onChange={(e) => handleParticipantChange(index, e)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addParticipant}
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Participant
      </button>
    </div>
  );
}
