import { IoNotificationsCircleOutline } from "react-icons/io5";
import React, { useState } from 'react';
import './Header.css';
import { CgProfile } from "react-icons/cg";

const Header = ({ hasUnreadNotifications }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleNotificationClick = () => {
        alert('Notifications');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignOut = () => {
        alert('You have signed out');
    };

    return (
        <div className='header'>
            <input type="text" placeholder="Search..." className="search-input" />
            <div className="icon-group">
                <button onClick={handleNotificationClick} className="icon" style={{ position: 'relative' }}>
                    <IoNotificationsCircleOutline size={40} />
                    {hasUnreadNotifications && <span className="notification-badge"></span>}
                </button>
                <div className='dropdown'>
                    <button onClick={toggleDropdown} className="dropdown">
                        <CgProfile size={30} style={{ marginRight: '5px' }} />
                        <b>  Ina Youn</b>
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-content" style={{ position: 'absolute', backgroundColor: '#f9f9f9', minWidth: '160px', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', zIndex: 1 }}>
                            <button onClick={handleSignOut} style={{ padding: '12px 16px', display: 'block', border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
