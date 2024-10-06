import React, { useState, useEffect, useMemo } from 'react';
import './Roles.css';
import { useTable } from 'react-table';
import axios from 'axios';
import Select from 'react-select';

const Roles = () => {
    const [searchInput, setSearchInput] = useState('');
    const [data, setData] = useState([]);

    const roleSelection = [
        { value: 'Author', label: 'Author' },
        { value: 'Reviewer', label: 'Reviewer' },
        { value: 'Organizer', label: 'Organizer' },
    ];

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://localhost:8080/users_name')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value.toLowerCase());
    };

    const handleRoleChange = (userId, selectedOptions) => {
        const selectedRoles = selectedOptions.map(option => option.value); // Extract the selected role values

        // Send updated roles to backend for the specific user ID
        axios.put(`http://localhost:8080/roles/${userId}`, { roles: selectedRoles })
            .then(response => {
                console.log('Role updated successfully', response.data);
                
                // Update the local state to reflect the role changes in the UI
                setData(prevData => 
                    prevData.map(user => 
                        user.id === userId ? { ...user, roles: selectedRoles.join(', ') } : user
                    )
                );
            })
            .catch(error => {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    console.error('Status code:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
            });
    };

    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.id.toString().includes(searchInput) ||
            item.firstName.toLowerCase().includes(searchInput) ||
            item.lastName.toLowerCase().includes(searchInput) ||
            item.email.toLowerCase().includes(searchInput) ||
            item.roles.toLowerCase().includes(searchInput)
        );
    }, [searchInput, data]);

    const columns = useMemo(() => [
        { Header: "ID", accessor: "id" },
        { Header: "First name", accessor: "firstName" },
        { Header: "Last name", accessor: "lastName" },
        { Header: "Email", accessor: "email" },
        { Header: "Role", accessor: "roles" },
        {
            // Dropdown for assigning roles
            Header: "Assign role",
            accessor: "role",
            Cell: ({ row }) => (
                <Select
                    options={roleSelection}
                    isMulti
                    value={roleSelection.filter(option => row.original.roles && row.original.roles.split(', ').includes(option.value))}
                    onChange={(selectedOptions) => handleRoleChange(row.original.id, selectedOptions)} // Pass user ID
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
            )
        },
    ], [roleSelection]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: filteredData });

    return (
        <div className='roles-container'>
            <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={handleSearchChange}
                className="search-input"
            />
            <table {...getTableProps()} className="roles-table">
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
    );
};

export default Roles;
