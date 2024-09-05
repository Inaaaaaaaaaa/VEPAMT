import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Review.css';
import { useTable } from 'react-table';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axios from 'axios';

const Review = () => {
    const [editingRowId, setEditingRowId] = useState(null);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define the paper selection options
    const paperSelection = useMemo(() => [
        { value: 'Comp702', label: 'Comp702' },
        { value: 'Comp703', label: 'Comp703' },
        { value: 'Comp603', label: 'Comp603' }
    ], []);

    // Fetch data from the backend
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/users_name')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleInputChange = useCallback((e, id, field) => {
        setData(prevData => prevData.map(item => item.id === id ? { ...item, [field]: e.target.value } : item));
    }, []);

    const handleSave = useCallback((id) => {
        const user = data.find(item => item.id === id);
        axios.put(`http://localhost:8080/users_name/${id}`, user)
            .then(response => {
                console.log('User updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
        setEditingRowId(null);
    }, [data]);

    const handlePaperChange = useCallback((selectedOptions, id) => {
        const papers = selectedOptions.map(option => option.value);
        const updatedData = data.map(item => item.id === id ? { ...item, paper_id: papers } : item);
        setData(updatedData);

        const user = updatedData.find(item => item.id === id);
        axios.put(`http://localhost:8080/users_name/${id}`, user)
            .then(response => {
                console.log('User updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    }, [data]);

    // Calculate total pages
    const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

    // Pagination: Calculate the data to display on the current page
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    // Calculate the page numbers dynamically
    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    // Debugging outputs
    console.log('Data Length:', data.length);
    console.log('Items Per Page:', itemsPerPage);
    console.log('Total Pages:', totalPages);
    console.log('Current Page:', currentPage);
    console.log('Page Numbers:', pageNumbers);

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
    ], [editingRowId, handleInputChange, handleSave, handlePaperChange, paperSelection]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: paginatedData });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
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
            
            <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}> Previous
        </button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''} > {number}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}> Next</button>
      </div>
        </>
    );
};

export default Review;
