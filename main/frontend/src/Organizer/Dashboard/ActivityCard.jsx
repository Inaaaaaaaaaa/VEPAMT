import React from 'react';

function ActivityCard({ events }) {
  
  const eventTypeConfig = {
    'assignment': {
      icon: (
        <svg className="w-9 h-9 fill-current text-emerald-50" viewBox="0 0 36 36">
          <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
        </svg>
      ),
      bgColor: 'bg-emerald-500',
    },
    'submission': {
      icon: (
        <svg className="w-9 h-9 fill-current text-yellow-50" viewBox="0 0 36 36">
          <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
        </svg>
      ),
      bgColor: 'bg-yellow-500',
    },
    'review': {
      icon: (
        <svg className="w-9 h-9 fill-current text-blue-50" viewBox="0 0 36 36">
          
          <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
        </svg>
      ),
      bgColor: 'bg-blue-500',
    },
    'message': {
      icon: (
        <svg className="w-9 h-9 fill-current text-red-50" viewBox="0 0 36 36">
          <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
        </svg>
      ),
      bgColor: 'bg-red-500',
    },
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Recent Activity</h2>
      </header>
      <div className="p-3">

        {/* Card content */}
        {events.map((event, index) => {
          const { type, person, action } = event;
          const config = eventTypeConfig[type] || {};

          return (
            <div key={index} className="flex px-2 mb-2">
              <div className={`w-9 h-9 rounded-full shrink-0 ${config.bgColor} my-2 mr-3`}>
                {config.icon}
              </div>
              <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
                <div className="grow flex justify-between">
                  <div className="self-center">
                    <a className="font-medium text-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-white" href="#0">{person}</a> {action}
                  </div>
                  <div className="shrink-0 self-end ml-2">
                    <a className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" href="#0">View<span className="hidden sm:inline"> -&gt;</span></a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityCard;
