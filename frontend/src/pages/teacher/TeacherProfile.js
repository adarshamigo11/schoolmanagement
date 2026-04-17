import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import ProfileCard from '../../components/ProfileCard';
import '../../styles/lightTheme.css';

const TeacherProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Box>
            <Box className="page-header">
                <Typography className="page-title">My Profile</Typography>
            </Box>
            
            <ProfileCard user={currentUser} role="Teacher" />
        </Box>
    );
};

export default TeacherProfile;
