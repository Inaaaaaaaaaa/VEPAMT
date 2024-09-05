import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Update.css';
import { useTable } from 'react-table';
import axios from 'axios';
import ChangePasswordCell from './ChangePasswordCell'; 

const Update = () => {
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [focusedInputId, setFocusedInputId] = useState(null); 

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:8080/users_name')
      .then(response => {
        console.log('Fetched data:', response.data);  // Debug: Check fetched data
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Log the data to check its structure
  useEffect(() => {
    console.log('Current data:', data);
  }, [data]);

  // Search bar
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  // Filter data based on search input
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.id.toString().includes(searchInput) ||
      item.firstName.toLowerCase().includes(searchInput) ||
      item.lastName.toLowerCase().includes(searchInput) ||
      item.email.toLowerCase().includes(searchInput) ||
      item.paperId.toString().includes(searchInput)
    );
  }, [searchInput, data]);

  // Define table columns
  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'First Name', accessor: 'firstName' },
    { Header: 'Last Name', accessor: 'lastName' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Password', accessor: 'password' },
    { Header: 'Change Password', accessor: 'changePassword', Cell: ({ row }) => (
      <ChangePasswordCell
        id={row.original.id}
        currentPassword={passwords[row.original.id] || ''}
        onPasswordChange={handlePasswordChange}
        onChangePassword={handleChangePassword}
        isFocused={focusedInputId === row.original.id}  // Check if this field should be focused
        setFocus={setFocusedInputId}  // Function to set the focus
      />
    ) },
  ], [passwords, focusedInputId]);

  // Handle password input changes
  const handlePasswordChange = (id, value) => {
    setPasswords(prevPasswords => ({
      ...prevPasswords,
      [id]: value,
    }));
  };

  // Handle password change
  const handleChangePassword = useCallback((id) => {
    const newPassword = passwords[id];
    if (newPassword) {
      axios.put(`http://localhost:8080/users_name/${id}/password`, { password: newPassword })
        .then(response => {
          console.log('Password updated:', response.data);
          // Optionally, refresh the data or update the state to reflect the change
          axios.get('http://localhost:8080/users_name')
            .then(response => {
              setData(response.data);
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        })
        .catch(error => {
          console.error('Error updating password:', error);
        });
    } else {
      console.error('New password is empty');
    }
  }, [passwords]);

  // Use react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: filteredData });

  return (
    <div className='background'>
          <div className='update-container'>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              console.log('Row:', row.original);  // Debug: Log each row data
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Update;