import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaperClipIcon, CalendarIcon, ClockIcon, MapIcon, UserIcon } from '@heroicons/react/20/solid';
import moment from 'moment';

export default function ConferenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conference, setConference] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [email, setEmail] = useState('');

  const fetchUsersByIds = async (userIds) => {
    try {
      const response = await fetch(`http://localhost:8080/api/userProfile/batch?ids=${userIds.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const usersData = await response.json();
      const authorsList = usersData.map(user => `${user.firstName} ${user.lastName}`).join(', ');
      setAuthors(authorsList);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/conferences/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setConference({
            ...data,
            authors: data.registeredUsers?.length > 0 ? data.registeredUsers.join(', ') : 'Unknown'
          });

          setTitle(data.title);
          setDate(moment(data.date).format('YYYY-MM-DD'));
          setStartTime(data.startTime);
          setLocation(data.location);
          setDescription(data.description);
          setAttachments(data.attachmentURL || []);
          setEmail(data.email || ''); // 设置邮箱
          if (data.registeredUsers) {
            fetchUsersByIds(data.registeredUsers);  // 获取用户详细信息
          }
        })
        .catch(error => console.error('Error fetching conference details:', error));
    } else {
      console.error('Conference ID is undefined');
    }
  }, [id]);

  if (!conference) {
    return <div>Loading...</div>;
  }

  const isDraft = conference.status === 'Draft';
  const handleBack = () => {
    navigate('/conference');
  };

  // 定义 extractFileName 函数
  const extractFileName = (path) => {
    return path.split('\\').pop().split('/').pop(); // 处理文件路径并返回文件名
  };
 // 保存会议信息
 const handleSave = async () => {
  try {
    if (!conference || !conference.conferenceID) {
      console.error('Conference ID is undefined in handleSave:', conference);
      alert('Conference ID is missing. Cannot save.');
      return;
    }

    const updatedConference = {
      ...conference,
      status: 'Waiting',
      title,
      date,
      startTime,
      location,
      description,
      email,
    };

    const response = await fetch(`http://localhost:8080/api/conferences/${conference.conferenceID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedConference),
    });

    if (!response.ok) {
      throw new Error('Failed to save conference');
    }

    const updatedData = await response.json();
    setConference(updatedData);
    alert('Conference information saved.');
  } catch (error) {
    console.error('Error saving conference:', error);
    alert('Failed to save conference');
  }
};
// 完成会议
const handleComplete = async () => {
  try {
    if (!conference || !conference.conferenceID) {
      console.error('Conference ID is undefined in handleComplete:', conference);
      alert('Conference ID is missing. Cannot complete.');
      return;
    }

    const updatedConference = {
      ...conference,
      status: 'Completed',
    };

    const response = await fetch(`http://localhost:8080/api/conferences/${conference.conferenceID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedConference),
    });

    if (!response.ok) {
      throw new Error('Failed to complete conference');
    }

    const updatedData = await response.json();
    setConference(updatedData);
    alert('Conference marked as Completed.');
  } catch (error) {
    console.error('Error completing conference:', error);
    alert('Failed to complete conference');
  }
};

if (!conference) {
  return <div>Loading...</div>;
}
  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back'}</button>
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Conference Details</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detailed information about the conference.</p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* 显示标题 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Conference Title</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isDraft ? (
                  <input
                    type="text"
                    className="border rounded p-1 w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                ) : (
                  conference.title
                )}
              </dd>
            </div>

            {/* 显示日期 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isDraft ? (
                  <input
                    type="date"
                    className="border rounded p-1 w-full"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    {date}
                  </div>
                )}
              </dd>
            </div>

            {/* 显示时间 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Time</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isDraft ? (
                  <input
                    type="time"  // 使用时间选择器
                    className="border rounded p-1 w-full"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    {conference.startTime}
                  </div>
                )}
              </dd>
            </div>


            {/* 显示位置 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isDraft ? (
                  <input
                    type="text"
                    className="border rounded p-1 w-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center">
                    <MapIcon className="h-5 w-5 text-gray-400 mr-2" />
                    {conference.location}
                  </div>
                )}
              </dd>
            </div>

            {/* 显示邮箱 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isDraft ? (
                  <input
                    type="email"
                    className="border rounded p-1 w-full"
                    value={conference.email || ''}
                    onChange={(e) => setConference({ ...conference, email: e.target.value })}
                  />
                ) : (
                  conference.email || 'No email provided'
                )}
              </dd>
            </div>

            {/* 显示描述 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Description</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isDraft ? (
                  <textarea
                    className="border rounded p-1 w-full"
                    rows="4"
                    value={conference.description || ''}
                    onChange={(e) => setConference({ ...conference, description: e.target.value })}
                  />
                ) : (
                  conference.description || 'No description provided'
                )}
              </dd>
            </div>


            {/* 显示作者（从 registeredUsers 获取） */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Authors</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {authors}  {/* 将 authors 列表显示为字符串 */}
                </div>
              </dd>
            </div>

            {/* 显示附件列表 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {attachments.length > 0 ? (
                    attachments.map((attachment, index) => {
                      const fileName = extractFileName(attachment);
                      return (
                        <li key={index} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                              <span className="truncate font-medium">{fileName}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href={`http://localhost:8080/api/conferences/download/${encodeURIComponent(fileName)}`}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              download
                            >
                              Download
                            </a>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      No attachments
                    </li>


                  )
                  }
                </ul>
              </dd>

          {/* 按钮部分 */}
          <div className="mt-4">
            {/* 如果会议状态是 'Draft' 或 'Waiting' 时显示 'Save' 按钮 */}
            {conference.status === 'Draft' || conference.status === 'Waiting' ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              >
                Save
              </button>
            ) : null}

            {/* 如果会议状态是 'Waiting' 时显示 'Complete' 按钮 */}
            {conference.status === 'Waiting' ? (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Complete
              </button>
            ) : null}

   
            </div>
 </div>

          </dl>
        </div>
      </div>
    </div>


  );
}
