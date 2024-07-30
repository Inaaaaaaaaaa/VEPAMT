// Sidebar.js
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import {

  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Submission', href: '/submission', icon: DocumentDuplicateIcon },
  { name: 'Conference', href: '/conference', icon: UsersIcon },
  { name: 'Message', href: '/message', icon: ChatBubbleBottomCenterIcon },
  { name: 'Calendar', href: '/Calendar', icon: CalendarIcon },
];



function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://australiancentre.com.br/wp-content/uploads/2017/02/AUT-logo-block-international-white.jpg"
                      alt="Your Company"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                  classNames(
                                    isActive ? 'bg-blue-100 text-blue-600 shadow' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    <item.icon
                                      className={classNames(
                                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600',
                                        'h-6 w-6 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <NavLink
                          to="/settings"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-blue-600"
                            aria-hidden="true"
                          />
                          Settings
                        </NavLink>
                        <NavLink
                          to="/support"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="sr-only">Support</span>
                          <span className="h-6 w-6 bg-blue-200 text-[0.625rem] font-medium text-blue-600 flex items-center justify-center rounded-lg">
                            S
                          </span>
                          <span className="truncate">Support</span>
                        </NavLink>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-16 w-auto"
              src="https://australiancentre.com.br/wp-content/uploads/2017/02/AUT-logo-block-international-white.jpg"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul  className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul  className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive ? 'bg-blue-100 text-blue-600 shadow' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={classNames(
                                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <NavLink
                  to="/settings"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-gray-500 group-hover:text-blue-600"
                    aria-hidden="true"
                  />
                  Settings
                </NavLink>
                <NavLink
                  to="/support"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="sr-only">Support</span>
                  <span className="h-6 w-6 bg-blue-200 text-[0.625rem] font-medium text-blue-600 flex items-center justify-center rounded-lg">
                    S
                  </span>
                  <span className="truncate">Support</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
