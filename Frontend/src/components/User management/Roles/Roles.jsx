import React, { useState, useEffect, useMemo } from 'react';
import './Roles.css';
import { useTable } from 'react-table';
import axios from 'axios';
import Select from 'react-select';

const Roles = () => {
    const [searchInput, setSearchInput] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    // Number of users per page
    const usersPerPage = 14; 

    // Role selection manually defined
    const roleSelection = [
        { value: 'Author', label: 'Author' },
        { value: 'Reviewer', label: 'Reviewer' },
        { value: 'Organizer', label: 'Organizer' },
    ];

    // Fetch data from the backend
    useEffect(() => {
        axios.get('http://localhost:8080/users_name')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value.toLowerCase());
    };

    // Handle role change and update in backend
    const handleRoleChange = (selectedOptions, id) => {
        const roles = selectedOptions.map(option => option.value);
        const updatedRole = roles.join(', ');
        const newData = data.map(item => {
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

    // Filter data based on the search input
    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.id.toString().includes(searchInput) ||
            item.firstName.toLowerCase().includes(searchInput) ||
            item.lastName.toLowerCase().includes(searchInput) ||
            item.email.toLowerCase().includes(searchInput) ||
            item.roles.toLowerCase().includes(searchInput)
        );
    }, [searchInput, data]);

    // Logic for pagination
    const pageCount = Math.ceil(filteredData.length / usersPerPage); // Calculate total number of pages
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage; // Starting index for current page
        const endIndex = startIndex + usersPerPage; // Ending index for current page
        return filteredData.slice(startIndex, endIndex); // Slice data to get only current page's data
    }, [currentPage, filteredData]);

    // List of column names and their database variables
    const columns = useMemo(() => [
        { Header: "ID", accessor: "id" },
        { Header: "First name", accessor: "firstName" },
        { Header: "Last name", accessor: "lastName" },
        { Header: "Email", accessor: "email" },
        { Header: "Role", accessor: "role" },
        {
            // Allow assigning roles via a dropdown box based on the roles in the database
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
    } = useTable({ columns, data: paginatedData }); // Pass paginated data to the table

    // Handle moving to the previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Handle moving to the next page
    const handleNextPage = () => {
        if (currentPage < pageCount) setCurrentPage(currentPage + 1);
    };

    return (
        // Contents within the container to display the tables
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

            {/* Pagination buttons */}
            <div className="pagination-roles">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {pageCount}</span>
                <button onClick={handleNextPage} disabled={currentPage === pageCount}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Roles;
