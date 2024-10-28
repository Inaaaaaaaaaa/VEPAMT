import React from 'react';
import { Link } from 'react-router-dom';

function SubmissionCard({ id, title, authors = [], keywords, submissionDate, status }) {
  
  // 根据状态返回不同的颜色样式
  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'unassigned':
        return 'bg-gray-500 text-gray-50';
      case 'assigned':
        return 'bg-blue-500 text-blue-50';
      case 'in review':
        return 'bg-yellow-500 text-yellow-50';
      case 'reviewed':
        return 'bg-green-500 text-green-50';
      case 'completed':
        return 'bg-purple-500 text-purple-50';
      default:
        return 'bg-slate-500 text-slate-50';
    }
  };

  // Format authors' names as "FirstName LastName" and join them with commas
  const formattedAuthors = authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');

  // Format the submission date to YYYY-MM-DD
  const formattedDate = new Date(submissionDate).toISOString().split('T')[0];

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col h-full p-5">
        <header>
          <div className="flex items-center justify-between">
            {/* 动态颜色的图标 */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusColor(status)}`}>
              <svg className="w-9 h-9 fill-current" viewBox="0 0 36 36">
                <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
              </svg>
            </div>
          </div>
        </header>
        <div className="grow mt-2">
          <Link className="inline-flex text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white mb-1" to={`/submission/${id}`}>
            <h2 className="text-xl leading-snug font-semibold">{title}</h2>
          </Link>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {formattedAuthors.length > 20 ? formattedAuthors.slice(0, 20) + '...' : formattedAuthors}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {keywords && keywords.length > 30 ? keywords.slice(0, 30) + '...' : keywords}
          </div>
        </div>
        <footer className="mt-5">
          <div className="text-sm font-medium text-slate-500 mb-2">Submission Date: {formattedDate}</div>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(status)}`}>{status}</div>
            </div>
            <div>
              <Link 
                className="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                to={`/submission/${id}`}
              >
                View -&gt;
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SubmissionCard;
