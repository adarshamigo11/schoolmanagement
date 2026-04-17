import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import ClassIcon from '@mui/icons-material/Class';
import '../styles/lightTheme.css';

const ProfileCard = ({ user, role }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return { bg: '#fef3c7', color: '#d97706' };
      case 'Teacher':
        return { bg: '#dbeafe', color: '#2563eb' };
      case 'Student':
        return { bg: '#d1fae5', color: '#059669' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const roleStyle = getRoleColor(role);

  const renderFields = () => {
    const fields = [];

    // Common fields
    fields.push(
      { icon: <BadgeIcon />, label: 'Full Name', value: user.name },
      { icon: <EmailIcon />, label: 'Email', value: user.email || 'N/A' },
    );

    // Role-specific fields
    if (role === 'Student') {
      fields.push(
        { icon: <BadgeIcon />, label: 'Roll Number', value: user.rollNum || 'N/A' },
        { icon: <ClassIcon />, label: 'Class', value: user.sclassName?.sclassName || 'N/A' },
        { icon: <SchoolIcon />, label: 'School', value: user.school?.schoolName || 'N/A' },
      );
    } else if (role === 'Teacher') {
      fields.push(
        { icon: <ClassIcon />, label: 'Subject', value: user.teachSubject?.subName || 'Not Assigned' },
        { icon: <ClassIcon />, label: 'Class', value: user.teachSclass?.sclassName || 'N/A' },
        { icon: <SchoolIcon />, label: 'School', value: user.school?.schoolName || 'N/A' },
      );
    } else if (role === 'Admin') {
      fields.push(
        { icon: <SchoolIcon />, label: 'School Name', value: user.schoolName || 'N/A' },
      );
    }

    return fields;
  };

  const fields = renderFields();

  return (
    <Box className="profile-card">
      {/* Header with gradient */}
      <Box 
        className="profile-header"
        sx={{
          background: role === 'Admin' 
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : role === 'Teacher'
            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        }}
      >
        <Box className="profile-avatar">
          {getInitials(user.name)}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {user.name}
        </Typography>
        <Chip 
          label={role}
          size="small"
          sx={{ 
            background: 'rgba(255,255,255,0.9)',
            color: roleStyle.color,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        />
      </Box>

      {/* Body with fields */}
      <Box className="profile-body">
        {fields.map((field, index) => (
          <Box key={index} className="profile-field">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {field.icon}
              </Box>
              <span className="profile-label">{field.label}</span>
            </Box>
            <span className="profile-value">{field.value}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProfileCard;
