import React, { useState, useEffect } from 'react';
import axios from 'axios';  // 用于发送 HTTP 请求
import { useNavigate } from 'react-router-dom';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import Select from 'react-select';

export default function AddConference() {
  const navigate = useNavigate();

  // 表单状态
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // 用于存储已选用户
  const [availableUsers, setAvailableUsers] = useState([]);  // 用户选择列表
  const [attachments, setAttachments] = useState([]); // 用于存储上传的附件
  const [error, setError] = useState(''); // 用于存储错误消息
  const [email, setEmail] = useState('');  // 定义 email 状态

  // 获取所有 usertype 为 author 的用户
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/authors');
        const userOptions = response.data.map(user => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`
        }));
        setAvailableUsers(userOptions);
      } catch (error) {
        console.error('Error fetching authors:', error);
        setError('Failed to load authors. Please try again.');
      }
    };

    fetchAuthors();
  }, []);

  // 提交表单的处理函数
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const registeredUsers = selectedUsers.map(user => user.value); // 提取用户 ID
  
    // 使用 FormData 构造数据，以支持文件上传
    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('startTime', startTime);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('registeredUsers', JSON.stringify(registeredUsers)); // 转换为字符串以便上传
    formData.append('email', email);  // 添加 email 字段

    attachments.forEach((file) => {
      formData.append('attachments', file);  // 添加附件到 FormData
    });
  
    try {
      const response = await axios.post('http://localhost:8080/api/conferences/add', formData);
      if (response.status === 200) {
        console.log('Conference added successfully');
        navigate('/conference'); // 导航回会议列表
      }
    } catch (error) {
      console.error('Error adding conference:', error);
    }
  };

  // 处理用户选择
  const handleUserSelect = (selectedOption) => {
    setSelectedUsers(selectedOption);
  };

  // 处理附件上传
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // 将 FileList 转为数组
    setAttachments(files);
  };

  return (
    <div className="p-4">
      <h3 className="text-base font-semibold leading-7 text-gray-900">Add New Conference</h3>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Conference Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Conference Title</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            id="startTime"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* 用户选择 */}
        <div>
          <label htmlFor="users" className="block text-sm font-medium text-gray-700">Select Registered Users (Authors)</label>
          <Select
            id="users"
            options={availableUsers}
            isMulti
            onChange={handleUserSelect}
            value={selectedUsers}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Attachments */}
        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">Attachments</label>
          <input
            type="file"
            id="attachments"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            onChange={handleFileUpload}
            multiple
          />
          <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
            {attachments.map((attachment, index) => (
              <li key={index} className="flex items-center justify-between py-2 px-4">
                <div className="flex items-center">
                  <PaperClipIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm">{attachment.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">
            Add Conference
          </button>
        </div>
      </form>
    </div>
  );
}
