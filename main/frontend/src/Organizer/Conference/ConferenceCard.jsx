import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

function ConferenceCard({ id, title, authors, date, status }) {
  // 只显示第一个作者
  const author = authors && authors.length > 0 ? authors[0] : 'Unknown';

  // 根据会议状态返回不同的颜色样式
  const statusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-500 text-gray-50';
      case 'Waiting':
        return 'bg-yellow-500 text-yellow-50';
      case 'Completed':
        return 'bg-green-500 text-green-50';
      case 'Delayed':
        return 'bg-red-500 text-red-50';
      default:
        return 'bg-slate-500 text-slate-50';
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).isValid() ? moment(dateString).format('DD/MM/YYYY') : 'N/A';
  };

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col h-full p-5">
        <header>
          <div className="flex items-center justify-between">
            {/* 动态颜色的图标 */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusColor(status)}`}>
              <svg className="w-9 h-9 fill-current text-sky-50" viewBox="0 0 36 36">
                <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
              </svg>
            </div>
          </div>
        </header>
        <div className="grow mt-2">
          <Link className="inline-flex text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white mb-1" to={`/conference/${id}`}>
            <h2 className="text-xl leading-snug font-semibold">{title}</h2>
          </Link>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Author: {author} {/* 只显示第一个作者 */}
          </div>
        </div>
        <footer className="mt-5">
          <div className="text-sm font-medium text-slate-500 mb-2">Date: {formatDate(date)}</div>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${statusColor(status)}`}>{status}</div>
            </div>
            <div>
              <Link className="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" to={`/conference/${id}`}>
                View -&gt;
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ConferenceCard;

