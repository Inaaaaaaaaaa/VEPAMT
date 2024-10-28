import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'Unassigned', label: 'Unassigned' },
  { value: 'draft', label: 'Draft' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'completed', label: 'Completed' },
  { value: 'in review', label: 'In Review' }
];


const SortDropdown = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (option) => {
    setSelectedOption(option);
    onSortChange(option ? option.value : null); // Pass null when cleared
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      placeholder="Sort by"
      isClearable // Allows users to clear their selection
    />
  );
};

export default SortDropdown;
