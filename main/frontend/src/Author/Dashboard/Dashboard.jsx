import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { fetchSubmissions } from '../../api'; // Adjust the import path as necessary

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384']; // Define colors for different statuses

function Dashboard() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    acceptanceRate: 0,
    averageReviewTime: 0,
    submissionsByMonth: [],
    submissionStatusDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch userId from localStorage
  useEffect(() => {

      // Helper function to get a value from cookies
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Get userID and role from cookies
  const storedUserId = getCookieValue('userID');

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID is undefined");
    }
  }, []);

  const groupSubmissionsByMonth = (submissions) => {
    const months = Array(12).fill(0);
    submissions.forEach((sub) => {
      const month = new Date(sub.submitDate).getMonth(); 
      months[month] += 1;
    });
    return months.map((count, index) => ({
      month: new Date(0, index).toLocaleString('en', { month: 'short' }),
      submissions: count,
    }));
  };

  const groupSubmissionsByStatus = (submissions) => {
    const statusCounts = {
      Draft: 0,
      Pending: 0,
      Resubmission: 0,
      Rejected: 0,
      Approved: 0,
      Submitted: 0
    };
  
    submissions.forEach((sub) => {
      switch (sub.status.toUpperCase()) {
        case 'DRAFT':
          statusCounts.Draft++;
          break;
        case 'PENDING':
          statusCounts.Pending++;
          break;
        case 'RESUBMISSION':
          statusCounts.Resubmission++;
          break;
        case 'REJECT':
          statusCounts.Rejected++;
          break;
        case 'APPROVE':
          statusCounts.Approved++;
          break;
        case 'SUBMITTED':
          statusCounts.Submitted++;
          break;
        default:
          break;
      }
    });
  
    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  };

  useEffect(() => {
    const calculateStatistics = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const submissionsData = await fetchSubmissions(userId, 0, 10); // Adjusted page to 0
        console.log("Full Fetched Submissions Data:", submissionsData); // View entire data structure
        
        const submissions = submissionsData.submissions || [];
        const totalSubmissions = submissions.length;
        console.log("Total Submissions:", totalSubmissions);

        const acceptedSubmissions = submissions.filter(sub => sub.status.toUpperCase() === 'APPROVE').length;
        const acceptanceRate = totalSubmissions ? (acceptedSubmissions / totalSubmissions) * 100 : 0;

        const averageReviewTime = 14; // Placeholder

        const submissionsByMonth = groupSubmissionsByMonth(submissions);
        const submissionStatusDistribution = groupSubmissionsByStatus(submissions);

        setStats({
          totalSubmissions,
          acceptanceRate,
          averageReviewTime,
          submissionsByMonth,
          submissionStatusDistribution,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError('Failed to fetch submission statistics.');
        setLoading(false);
      }
    };

    calculateStatistics();
  }, [userId]);

  if (loading) {
    return <div>Loading submission statistics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">Author Submission Statistics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total Submissions</p>
          <h2 className="text-4xl font-bold mt-2">{stats.totalSubmissions}</h2>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <p className="text-gray-500 text-sm">Acceptance Rate</p>
          <h2 className="text-4xl font-bold mt-2">{stats.acceptanceRate.toFixed(2)}%</h2>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <p className="text-gray-500 text-sm">Avg. Review Time</p>
          <h2 className="text-4xl font-bold mt-2">{stats.averageReviewTime} days</h2>
        </div>
      </div>

      <div className="p-4 bg-white shadow-sm rounded-lg mb-6 mt-6">
        <h3 className="text-lg font-semibold">Submissions by Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.submissionsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="submissions" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-white shadow-sm rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Submission Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.submissionStatusDistribution.filter(entry => entry.value > 0)}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
              dataKey="value"
              fill="#8884d8"
            >
              {stats.submissionStatusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
