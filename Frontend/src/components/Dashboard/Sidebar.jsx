import './Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiCalendarScheduleFill } from "react-icons/ri";
import { SiPowerpages } from "react-icons/si";
import { RiAdminFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { MdRateReview } from "react-icons/md";
import { FaClipboardUser } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";
import { FaPerson } from "react-icons/fa6";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        // Optionally clear any stored data here
        // e.g., localStorage.clear(), sessionStorage.clear(), etc.

        // Redirect to the login page
        navigate('/login');
    }

    // Function to check if the current route matches the link path
    const isActive = (path) => location.pathname === path;

    return (
        <div className='sidenav'>
            <h1>Admin</h1>
            <p>_________________________</p>
            <ul>

                {/* USER MANAGEMENT */}
                <li>
                    <h3>User Management</h3>
                    <Link to="/dashboard/history" className={isActive('/dashboard/history') ? 'active' : ''}>
                        <RiAdminFill size={30}/> Login and Register History
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/roles" className={isActive('/dashboard/roles') ? 'active' : ''}>
                        <RiAdminFill size={30}/> Assign Roles
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/update" className={isActive('/dashboard/update') ? 'active' : ''}>
                        <FaClipboardUser size={30}/> Update user 
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/view" className={isActive('/dashboard/view') ? 'active' : ''}>
                        <FaPerson size={30}/> View all users
                    </Link>
                </li>

                {/* PAPER MANAGEMENT */}
                <li>
                <p>_________________________</p>                    
                    <h3>Paper</h3>
                    <Link to="/dashboard/submissions" className={isActive('/dashboard/submissions') ? 'active' : ''}>
                        <MdRateReview size={30}/> Submissions 
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/review-management" className={isActive('/dashboard/review-management') ? 'active' : ''}>
                        <SiPowerpages size={30}/> Review Management  
                    </Link>
                </li>

                {/* OTHER MANAGEMENT */}
                <li>
                <p>_________________________</p>
                    <h3>Other</h3>
                    <Link to="/dashboard/conferences" className={isActive('/dashboard/conferences') ? 'active' : ''}>
                        <RiCalendarScheduleFill size={30}/> Conference
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/notifications" className={isActive('/dashboard/notifications') ? 'active' : ''}>
                        <IoMdAnalytics size={30}/> Notifications
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard/settings" className={isActive('/dashboard/settings') ? 'active' : ''}>
                        <IoMdSettings size={30}/> Settings
                    </Link>
                </li>

                {/* LOG OUT */}
                <li>
                <p>_________________________</p>
                    <Link to="/" onClick={handleLogout}>
                        <IoLogOutSharp size={30}/> Log out
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar;
