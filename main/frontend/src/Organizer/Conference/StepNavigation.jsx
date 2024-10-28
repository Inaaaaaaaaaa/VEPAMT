import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const steps = [
  { id: 'Step 1', name: 'Submission Selection', href: '/add-conference/step-1', status: 'complete' },
  { id: 'Step 2', name: 'Participant Information', href: '/add-conference/step-2', status: 'current' },
  { id: 'Step 3', name: 'Date Selection', href: '/add-conference/step-3', status: 'upcoming' },
  { id: 'Step 4', name: 'Location Selection', href: '/add-conference/step-4', status: 'upcoming' },
  { id: 'Step 5', name: 'Upload Documents', href: '/add-conference/step-5', status: 'upcoming' },
  { id: 'Step 6', name: 'Confirmation & Preview', href: '/add-conference/step-6', status: 'upcoming' },
];

export default function StepNavigation() {
  const location = useLocation();

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <Link
              to={step.href}
              className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                location.pathname === step.href
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              aria-current={location.pathname === step.href ? 'step' : undefined}
            >
              <span className={`text-sm font-medium ${location.pathname === step.href ? 'text-indigo-600' : 'group-hover:text-gray-700'}`}>
                {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
