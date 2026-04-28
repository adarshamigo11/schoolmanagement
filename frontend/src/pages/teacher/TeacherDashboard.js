import { useState, useEffect } from 'react';
import {
    Box,
    List,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import TeacherSideBar from './TeacherSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';

import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import '../../styles/lightTheme.css';

const TeacherDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(!isMobile);

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleNavClick = () => {
        if (isMobile) setOpen(false);
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
                    height: { xs: '60px', sm: '70px' },
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: { xs: '0 12px', sm: '0 24px' },
                    zIndex: 1200,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
            >
                <IconButton
                    onClick={toggleDrawer}
                    sx={{
                        color: '#475569',
                        marginRight: { xs: '8px', sm: '16px' },
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
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Teacher Dashboard
                </Typography>
                <AccountMenu />
            </Box>

            {/* Mobile Backdrop */}
            {isMobile && open && (
                <Box
                    onClick={toggleDrawer}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 1099,
                    }}
                />
            )}

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{
                    position: 'fixed',
                    left: 0,
                    top: { xs: '60px', sm: '70px' },
                    bottom: 0,
                    width: open ? '260px' : '0px',
                    background: 'white',
                    borderRight: '1px solid #e2e8f0',
                    transition: 'width 0.3s ease',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    zIndex: 1100,
                    boxShadow: isMobile && open ? '4px 0 12px rgba(0,0,0,0.1)' : 'none',
                }}
            >
                {isMobile && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '8px 12px',
                        borderBottom: '1px solid #e2e8f0'
                    }}>
                        <IconButton onClick={toggleDrawer} size="small" sx={{ color: '#475569' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}
                <List component="nav" sx={{ padding: '16px 12px', minWidth: '260px' }} onClick={handleNavClick}>
                    <TeacherSideBar />
                </List>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    marginLeft: (open && !isMobile) ? '260px' : '0px',
                    marginTop: { xs: '60px', sm: '70px' },
                    padding: { xs: '16px', sm: '24px', md: '32px' },
                    minHeight: 'calc(100vh - 60px)',
                    transition: isMobile ? 'none' : 'margin-left 0.3s ease',
                    background: '#f8fafc',
                    overflowX: 'hidden',
                    width: '100%',
                    maxWidth: '100%',
                }}
            >
                <Routes>
                    <Route path="/" element={<TeacherHomePage />} />
                    <Route path='*' element={<Navigate to="/" />} />
                    <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                    <Route path="/Teacher/profile" element={<TeacherProfile />} />

                    <Route path="/Teacher/complain" element={<TeacherComplain />} />

                    <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                    <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />

                    <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                    <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default TeacherDashboard;
