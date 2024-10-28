import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';

const steps = [
  { id: 'Step 1', name: 'Author Information', step: 'step-1' },
  { id: 'Step 2', name: 'Submission Information', step: 'step-2' },
  { id: 'Step 3', name: 'File Upload', step: 'step-3' },
];

export default function StepNavigation() {
  const { userID } = useContext(AuthContext); // 获取 userID
  const location = useLocation();

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <Link
              to={`/user/${userID}/create-submission/${step.step}`}
              className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                location.pathname === `/user/${userID}/create-submission/${step.step}`
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              aria-current={location.pathname === `/user/${userID}/create-submission/${step.step}` ? 'step' : undefined}
            >
              <span className={`text-sm font-medium ${location.pathname === `/user/${userID}/create-submission/${step.step}` ? 'text-indigo-600' : 'group-hover:text-gray-700'}`}>
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
