import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function MessageCard({ title, author, time, content, type }) {
  // 根据消息类型返回不同的颜色样式
  const typeColor = (type) => {
    switch (type) {
      case 'Info':
        return 'bg-blue-500 text-blue-50';
      case 'Warning':
        return 'bg-yellow-500 text-yellow-50';
      case 'Error':
        return 'bg-red-500 text-red-50';
      case 'Success':
        return 'bg-green-500 text-green-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  // 定义弹出窗口的状态
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col h-full p-5">
        <header>
          <div className="flex items-center justify-between">
            {/* 动态颜色的图标 */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColor(type)}`}>
              <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
                <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
              </svg>
            </div>
          </div>
        </header>
        <div className="grow mt-2">
          <h2 className="text-xl leading-snug font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h2>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Author: {author}
          </div>
        </div>
        <footer className="mt-5">
          <div className="text-sm font-medium text-slate-500 mb-2">Time: {time}</div>
          <div className="flex justify-between items-center">
            <div>
              <button 
                className="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={openModal}
              >
                View -&gt;
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* 弹出窗口 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{content}</p>
            <button 
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageCard;
