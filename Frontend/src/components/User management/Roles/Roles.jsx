import React, { useState, useEffect, useMemo } from 'react';
import './Roles.css';
import { useTable } from 'react-table';
import axios from 'axios';
import Select from 'react-select';

const Roles = () => {
    const [searchInput, setSearchInput] = useState('');
    const [data, setData] = useState([]);

    const roleSelection = [
        //role selection manually 
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

    const handleRoleChange = (selectedOptions, id) => {
        const roles = selectedOptions.map(option => option.value);
        const updatedRole = roles.join(', ');
        const newData = data.map(item => {
            //if item is updated, update this in backend 
            if (item.id === id) {
                return { ...item, roles: updatedRole };
            }
            return item;
        });
        setData(newData);

        // Send updated role to the backend and connect to the backend
        axios.put(`http://localhost:8080/users_name/${id}`, { roles: updatedRole })
            .then(response => {
                console.log('Role updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating role:', error);
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

    //list of column name and their database variables 
    const columns = useMemo(() => [
        { Header: "ID", accessor: "id" },
        { Header: "First name", accessor: "firstName" },
        { Header: "Last name", accessor: "lastName" },
        { Header: "Email", accessor: "email" },
        { Header: "Role", accessor: "role" },
        {
            //allow assign roles to be a drop downbox based on the roles in the database
            Header: "Assign role",
            accessor: "roles",
            Cell: ({ row }) => (
                <Select
                    options={roleSelection} isMulti
                    value={roleSelection.filter(option => row.original.role && row.original.role.split(', ').includes(option.value))}
                    onChange={(selectedOptions) => handleRoleChange(selectedOptions, row.original.id)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
            )
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: filteredData });

    return (
        //contents within the container to display the tables
            <div className='roles-container'>
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
