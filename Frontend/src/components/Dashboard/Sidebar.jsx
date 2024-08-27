import './Sidebar.css';
import { NavLink } from 'react-router-dom';
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
    return (
        <div className='sidenav'>
            <h1>Admin</h1>
            <p>_________________________</p>
            <ul>

                {/*USER MANAGEMENT*/}
                <li>
                    <h3>User Management</h3>
                    <NavLink to="/history" activeClassName="active-link">
                    <RiAdminFill size={30}/> Login and Register History
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/roles" activeClassName="active-link">
                    <RiAdminFill size={30}/> Assign Roles
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/update" activeClassName="active-link">
                    <FaClipboardUser size={30}/> Update user 
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/view" activeClassName="active-link">
                    <FaPerson size={30}/> View all users
                    </NavLink>
                </li>

                {/*PAPER MANAGEMENT*/}
                <li>
                <p>_________________________</p>                    
                    <h3>Paper</h3>
                    <NavLink to="/submissions" activeClassName="active-link">
                        <MdRateReview size={30}/> Submissions 
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/review-management" activeClassName="active-link">
                        <SiPowerpages size={30}/> Review Management  
                    </NavLink>
                </li>

                {/*OTHER MANAGEMENT*/}
                <li>
                <p>_________________________</p>
                    <h3>Other</h3>
                    <NavLink to="/conferences" activeClassName="active-link">
                        <RiCalendarScheduleFill size={30}/> Conference
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notifications" activeClassName="active-link">
                        <IoMdAnalytics size={30}/> Notifications
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings" activeClassName="active-link">
                        <IoMdSettings size={30}/> Settings
                    </NavLink>
                </li>

                {/*LOG OUT*/}
                <li>
                <p>_________________________</p>
                    <NavLink to="/" activeClassName="active-link">
                        <IoLogOutSharp size={30}/> Log out
                    </NavLink>
                </li>
            </ul>
            </div>
    )
}

export default Sidebar;
