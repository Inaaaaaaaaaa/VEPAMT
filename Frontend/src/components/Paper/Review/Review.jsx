import React, { useState, useEffect, useMemo } from 'react';
import './Review.css';
import { useTable } from "react-table";
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axios from 'axios';

const Review = () => {
    const [editingRowId, setEditingRowId] = useState(null);
    const [data, setData] = useState([]);

    const paperSelection = [
        { value: 'Comp702', label: 'Comp702' },
        { value: 'Comp703', label: 'Comp703' },
        { value: 'Comp603', label: 'Comp603' }
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

    const handleInputChange = (e, id, field) => {
        const newData = data.map(item => item.id === id ? { ...item, [field]: e.target.value } : item);
        setData(newData);
    };

    const handleSave = (id) => {
        const user = data.find(item => item.id === id);
        axios.put(`http://localhost:8080/users_name/${id}`, user)
            .then(response => {
                console.log('User updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
        setEditingRowId(null);
    };

    const handlePaperChange = (selectedOptions, id) => {
        const papers = selectedOptions.map(option => option.value);
        const newData = data.map(item => item.id === id ? { ...item, paper_id: papers } : item);
        setData(newData);

        const user = newData.find(item => item.id === id);
        axios.put(`http://localhost:8080/users_name/${id}`, user)
            .then(response => {
                console.log('User updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    };

    const columns = useMemo(() => [
        { Header: "ID", accessor: "id" },
        { Header: "First name", accessor: "firstName", Cell: ({ row }) => (
            editingRowId === row.original.id ? (
                <input
                    type="text"
                    value={row.original.firstName || ''}
                    onChange={(e) => handleInputChange(e, row.original.id, 'firstName')}
                    onBlur={() => handleSave(row.original.id)}
                    autoFocus
                />
            ) : (
                <span onClick={() => setEditingRowId(row.original.id)}>{row.original.firstName}</span>
            )
        )},
        { Header: "Last name", accessor: "lastName", Cell: ({ row }) => (
            editingRowId === row.original.id ? (
                <input
                    type="text"
                    value={row.original.lastName || ''}
                    onChange={(e) => handleInputChange(e, row.original.id, 'lastName')}
                    onBlur={() => handleSave(row.original.id)}
                    autoFocus
                />
            ) : (
                <span onClick={() => setEditingRowId(row.original.id)}>{row.original.lastName}</span>
            )
        )},
        { Header: "Email", accessor: "email", Cell: ({ row }) => (
            editingRowId === row.original.id ? (
                <input
                    type="text"
                    value={row.original.email || ''}
                    onChange={(e) => handleInputChange(e, row.original.id, 'email')}
                    onBlur={() => handleSave(row.original.id)}
                    autoFocus
                />
            ) : (
                <span onClick={() => setEditingRowId(row.original.id)}>{row.original.email}</span>
            )
        )},
        { Header: "Paper ID", accessor: "paper_id", Cell: ({ row }) => (
            <Select
                options={paperSelection}
                isMulti
                value={paperSelection.filter(option => Array.isArray(row.original.paper_id) && row.original.paper_id.includes(option.value))}
                onChange={(selectedOptions) => handlePaperChange(selectedOptions, row.original.id)}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        )}
    ], [editingRowId, data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    return (
        <div className='background'>
            <div className='review-container'>
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
        </div>
    );
};

export default Review;
