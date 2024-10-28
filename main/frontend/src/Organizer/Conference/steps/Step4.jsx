import React, { useState } from 'react';

export default function Step4() {
  const [location, setLocation] = useState('');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 4: Location Selection</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conference Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}
