import React from 'react';
import '../styles/designSystem.css';

const AccountCard = ({ user, role }) => {
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'var(--gradient-gold)';
      case 'Teacher':
        return 'var(--gradient-primary)';
      case 'Student':
        return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      default:
        return 'var(--gradient-primary)';
    }
  };

  const renderDetails = () => {
    const commonDetails = [
      { label: 'Name', value: user.name },
      { label: 'Email', value: user.email || 'N/A' },
      { label: 'Role', value: role },
    ];

    if (role === 'Student') {
      return [
        ...commonDetails,
        { label: 'Roll Number', value: user.rollNum || 'N/A' },
        { label: 'Class', value: user.sclassName?.sclassName || 'N/A' },
        { label: 'School', value: user.school?.schoolName || 'N/A' },
      ];
    }

    if (role === 'Teacher') {
      return [
        ...commonDetails,
        { label: 'Subject', value: user.teachSubject?.subName || 'Not Assigned' },
        { label: 'Class', value: user.teachSclass?.sclassName || 'N/A' },
        { label: 'School', value: user.school?.schoolName || 'N/A' },
      ];
    }

    if (role === 'Admin') {
      return [
        ...commonDetails,
        { label: 'School Name', value: user.schoolName || 'N/A' },
      ];
    }

    return commonDetails;
  };

  const details = renderDetails();

  return (
    <div className="account-card">
      <div className="account-card-header">
        <div 
          className="account-avatar"
          style={{ background: getRoleColor(role) }}
        >
          {getInitials(user.name)}
        </div>
        <div className="account-info">
          <h3>{user.name}</h3>
          <p>{role} Account</p>
        </div>
      </div>
      
      <div className="account-details">
        {details.map((detail, index) => (
          <div key={index} className="detail-row">
            <span className="detail-label">{detail.label}</span>
            <span className="detail-value">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountCard;
