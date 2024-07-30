// ProfileDetail.jsx
import React from 'react';

export default function ProfileDetail() {
  return (
    <div className="divide-y divide-gray-200">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="md:col-span-2 flex items-center gap-x-8">
          <div>
            <h2 className="text-lg font-semibold leading-7 text-gray-900">Profile</h2>
            <img
              src="https://australiancentre.com.br/wp-content/uploads/2017/02/AUT-logo-block-international-white.jpg"
              alt=""
              className="mt-4 h-32 w-32 flex-none rounded-lg bg-gray-800 object-cover"
            />
          </div>
          <div>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Change avatar
            </button>
            <p className="mt-2 text-sm leading-5 text-gray-600">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-lg font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 bg-gray-100 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-lg font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 bg-gray-100 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 bg-gray-100 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="job-title" className="block text-lg font-medium leading-6 text-gray-900">
                Job Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  autoComplete="job-title"
                  className="block w-full rounded-md border-0 bg-gray-100 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="organization" className="block text-lg font-medium leading-6 text-gray-900">
                Organization
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  autoComplete="organization"
                  className="block w-full rounded-md border-0 bg-gray-100 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="timezone" className="block text-lg font-medium leading-6 text-gray-900">
                Timezone
              </label>
              <div className="mt-2">
                <select
                  id="timezone"
                  name="timezone"
                  className="block w-full rounded-md border-0 bg-gray-100 py-2 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6 [&_*]:text-black"
                >
                  <option>Pacific Standard Time</option>
                  <option>Eastern Standard Time</option>
                  <option>Greenwich Mean Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
