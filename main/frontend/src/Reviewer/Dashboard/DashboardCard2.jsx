import React from 'react';

const DashboardCard2 = ({ submissions }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
      {/* 限制高度并允许垂直滚动 */}
      <div className="overflow-y-auto" style={{ maxHeight: '245px' }}>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="border px-4 py-2">{submission.id}</td>
                <td className="border px-4 py-2">{submission.title}</td>
                <td className="border px-4 py-2">{submission.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardCard2;
