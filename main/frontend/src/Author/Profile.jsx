// Profile.jsx
import React from 'react';
import ProfileDetail from './ProfileDetail';

export default function Profile() {
  return (
    <div className="xl:pl-72">
      <main>
        <h1 className="sr-only">Account Settings</h1>
        <ProfileDetail />
      </main>
    </div>
  );
}
