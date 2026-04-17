import { useState } from 'react';
import {
    Box,
    List,
    Typography,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import '../../styles/lightTheme.css';

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box className="dashboard-container">
            {/* App Bar */}
            <Box
                component="header"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    zIndex: 1200,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
            >
                <IconButton
                    onClick={toggleDrawer}
                    sx={{
                        color: '#475569',
                        marginRight: '16px',
                        '&:hover': { background: '#f1f5f9' }
                    }}
                >
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        color: '#1e293b',
                        fontWeight: 700,
                        fontSize: '1.25rem'
                    }}
                >
                    Student Dashboard
                </Typography>
                <AccountMenu />
            </Box>

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    position: 'fixed',
                    left: 0,
                    top: '70px',
                    bottom: 0,
                    width: open ? '260px' : '0px',
                    background: 'white',
                    borderRight: '1px solid #e2e8f0',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                    zIndex: 1100,
                }}
            >
                <List component="nav" sx={{ padding: '16px 12px' }}>
                    <StudentSideBar />
                </List>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    marginLeft: open ? '260px' : '0px',
                    marginTop: '70px',
                    padding: '32px',
                    minHeight: 'calc(100vh - 70px)',
                    transition: 'margin-left 0.3s ease',
                    background: '#f8fafc',
                }}
            >
                <Routes>
                    <Route path="/" element={<StudentHomePage />} />
                    <Route path='*' element={<Navigate to="/" />} />
                    <Route path="/Student/dashboard" element={<StudentHomePage />} />
                    <Route path="/Student/profile" element={<StudentProfile />} />

                    <Route path="/Student/subjects" element={<StudentSubjects />} />
                    <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                    <Route path="/Student/complain" element={<StudentComplain />} />

                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default StudentDashboard;
