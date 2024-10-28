import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Roles.css';
import { useTable } from 'react-table';
import axios from 'axios';
import Select from 'react-select';

const Roles = () => {
    const [data, setData] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedRoleFilters, setSelectedRoleFilters] = useState([]); // Array for multiple roles
    const [nameSort, setNameSort] = useState('');

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
        let filtered = [...data];
        
        if (selectedRoleFilters.length > 0) {
            filtered = filtered.filter(user => 
                selectedRoleFilters.some(role => user.roles.includes(role))
            );
        }
        
        if (nameSort) {
            if (nameSort === 'ascFirst') {
                filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
            } else if (nameSort === 'descFirst') {
                filtered.sort((a, b) => b.firstName.localeCompare(a.firstName));
            } else if (nameSort === 'ascLast') {
                filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
            } else if (nameSort === 'descLast') {
                filtered.sort((a, b) => b.lastName.localeCompare(a.lastName));
            }
        }

        return filtered;
    }, [data, selectedRoleFilters, nameSort]);

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

    // Filter Modal Toggle
    const toggleFilterModal = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    // Handle Role Filter Toggle for multiple roles
    const handleRoleFilterChange = (selectedRole) => {
        setSelectedRoleFilters(prevRoles => 
            prevRoles.includes(selectedRole)
                ? prevRoles.filter(role => role !== selectedRole) // Remove if already selected
                : [...prevRoles, selectedRole] // Add if not already selected
        );
    };

    // Handle Name Sort Toggle (only one sorting option at a time)
    const handleNameSortChange = (sortOption) => {
        setNameSort(prevSort => (prevSort === sortOption ? '' : sortOption));
    };

    return (
        <div className='roles-container'>
            {/* Filter Button */}
            <button onClick={toggleFilterModal} className="filter-button">Filter</button>

            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="filter-modal-overlay" onClick={toggleFilterModal}>
                    <div className="filter-modal" onClick={e => e.stopPropagation()}>
                        <h3>Filter Options</h3>
                        <div>
                            <p>Role:</p>
                            {roleSelection.map(role => (
                                <button 
                                    key={role.value}
                                    onClick={() => handleRoleFilterChange(role.value)}
                                    className={`filter-option-button ${selectedRoleFilters.includes(role.value) ? 'selected' : ''}`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                        <div>
                            <p>Name:</p>
                            <button 
                                onClick={() => handleNameSortChange('ascFirst')} 
                                className={`filter-option-button ${nameSort === 'ascFirst' ? 'selected' : ''}`}
                            >
                                Ascending by First Name
                            </button>
                            <button 
                                onClick={() => handleNameSortChange('descFirst')} 
                                className={`filter-option-button ${nameSort === 'descFirst' ? 'selected' : ''}`}
                            >
                                Descending by First Name
                            </button>
                            <button 
                                onClick={() => handleNameSortChange('ascLast')} 
                                className={`filter-option-button ${nameSort === 'ascLast' ? 'selected' : ''}`}
                            >
                                Ascending by Last Name
                            </button>
                            <button 
                                onClick={() => handleNameSortChange('descLast')} 
                                className={`filter-option-button ${nameSort === 'descLast' ? 'selected' : ''}`}
                            >
                                Descending by Last Name
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
