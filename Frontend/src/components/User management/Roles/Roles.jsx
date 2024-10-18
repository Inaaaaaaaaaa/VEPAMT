import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Roles.css';
import { useTable } from 'react-table';
import axios from 'axios';
import Select from 'react-select';

const Roles = () => {
    const [searchInput, setSearchInput] = useState('');
    const [data, setData] = useState([]);

    const roleSelection = useMemo(() => [
        { value: 'Author', label: 'Author' },
        { value: 'Reviewer', label: 'Reviewer' },
        { value: 'Organizer', label: 'Organizer' },
    ], []);

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

    const handleRoleChange = useCallback((userId, selectedOptions) => {
        const selectedRoles = selectedOptions.map(option => option.value);

        axios.put(`http://localhost:8080/roles/${userId}`, { roles: selectedRoles })
            .then(response => {
                console.log('Role updated successfully', response.data);
                setData(prevData => 
                    prevData.map(user => 
                        user.id === userId && user.roles !== selectedRoles.join(', ') 
                        ? { ...user, roles: selectedRoles.join(', ') } 
                        : user
                    )
                );
            })
            .catch(error => {
                console.error('Error updating roles:', error);
            });
    }, []);

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
            Header: "Assign role",
            accessor: "role",
            Cell: ({ row }) => {
                const selectedValues = useMemo(() => {
                    return roleSelection.filter(option => 
                        row.original.roles && row.original.roles.split(', ').includes(option.value)
                    );
                }, [row.original.roles, roleSelection]);

                return (
                    <Select
                        options={roleSelection}
                        isMulti
                        value={selectedValues}
                        onChange={(selectedOptions) => handleRoleChange(row.original.id, selectedOptions)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                );
            }
        }
    ], [roleSelection, handleRoleChange]);

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
                                <th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                                    <td key={cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
