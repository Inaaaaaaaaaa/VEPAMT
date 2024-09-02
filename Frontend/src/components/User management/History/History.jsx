import React, { useState, useEffect, useMemo } from 'react';
import './History.css';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const History = () => {
  const [data, setData] = useState([]);

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

  // Prepare data for the chart
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //Data contains information that includes the month of activity.
    const loginsPerMonth = new Array(12).fill(0);
    const registrationsPerMonth = new Array(12).fill(0);

    data.forEach(user => {
      const loginMonth = new Date(user.lastLoggedIn).getMonth();
      const registrationMonth = new Date(user.lastRegistered).getMonth();

      loginsPerMonth[loginMonth] += 1;
      registrationsPerMonth[registrationMonth] += 1;
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Logins',
          data: loginsPerMonth,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Registrations',
          data: registrationsPerMonth,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Login and Registration History 2024',
        padding: {
          top: 0, 
          bottom: 10, 
        },
        position: 'top', 
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of logins/register',
        },
        suggestedMin: 0,
        ticks: {
          stepSize: 1,
        }
      },
    },
  };

  // Define table columns
  const columns = useMemo(() => [
    { Header: 'First Name', accessor: 'firstName' },
    { Header: 'Last Name', accessor: 'lastName' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Last Logged In', accessor: 'lastLoggedIn' },
    { Header: 'Last Registered', accessor: 'lastRegistered' },
  ], []);

  // Use react-table hooks with pagination
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using `rows`, use `page`
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Start on the first page
    },
    usePagination
  );

  return (
      <div className='update-container'>
        {/* Chart component */}
        <div className='chart-container'>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Pagination */}
        <div className='pagination'>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          {pageOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => gotoPage(index)}
              className={pageIndex === index ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
        </div>

        {/* Table component */}
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
            {page.map(row => {
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

export default History;
