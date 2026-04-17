import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  InputAdornment, 
  CircularProgress, 
  Backdrop,
  Container,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import '../styles/lightTheme.css';

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'rollNumber') setRollNumberError(false);
    if (name === 'studentName') setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = "123";

    if (role === "Admin") {
      const email = "admin231";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (role === "Student") {
      const rollNum = "1";
      const studentName = "Dipesh Awasthi";
      const fields = { rollNum, studentName, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    } else if (role === "Teacher") {
      const email = "tony@12";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <Box className="login-container">
      {/* Left Side - Branding */}
      <Box sx={{ 
        flex: 1, 
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)'
      }}>
        <Box sx={{
          width: '100px',
          height: '100px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)'
        }}>
          <SchoolIcon sx={{ fontSize: '56px', color: 'white' }} />
        </Box>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          color: '#1e293b',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          School Management
        </Typography>
        <Typography variant="h6" sx={{ 
          color: '#475569',
          textAlign: 'center',
          maxWidth: '400px',
          fontWeight: 400
        }}>
          Empowering education with modern technology for Indian schools
        </Typography>
      </Box>

      {/* Right Side - Login Form */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <Paper elevation={0} className="login-card">
          <Box className="login-logo">
            <SchoolIcon sx={{ fontSize: '40px' }} />
          </Box>

          <Box sx={{ textAlign: 'center', marginBottom: '32px' }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              {role} Login
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Welcome back! Please enter your details
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {role === "Student" ? (
              <>
                <TextField
                  required
                  fullWidth
                  id="rollNumber"
                  label="Roll Number"
                  name="rollNumber"
                  autoComplete="off"
                  type="number"
                  error={rollNumberError}
                  helperText={rollNumberError && 'Roll Number is required'}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }}
                />
                <TextField
                  required
                  fullWidth
                  id="studentName"
                  label="Student Name"
                  name="studentName"
                  autoComplete="name"
                  error={studentNameError}
                  helperText={studentNameError && 'Name is required'}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }}
                />
              </>
            ) : (
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError}
                helperText={emailError && 'Email is required'}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#f8fafc',
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  }
                }}
              />
            )}
            
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={toggle ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={passwordError}
              helperText={passwordError && 'Password is required'}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setToggle(!toggle)}
                      sx={{ color: '#64748b' }}
                    >
                      {toggle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: '#f8fafc',
                  borderRadius: '10px',
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '2px' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="#" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </Box>

            <button
              type="submit"
              className="btn-primary"
              style={{ 
                marginTop: '8px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              {loader ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={guestModeHandler}
              className="btn-outline"
              style={{ width: '100%' }}
            >
              {guestLoader ? (
                <CircularProgress size={20} sx={{ color: '#3b82f6' }} />
              ) : (
                "Login as Guest"
              )}
            </button>

            {role === "Admin" && (
              <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Don't have an account?{' '}
                  <Link to="/Adminregister" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(30, 41, 59, 0.8)'
        }}
        open={guestLoader}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#3b82f6', marginBottom: '16px' }} />
          <Typography sx={{ color: 'white' }}>Please Wait...</Typography>
        </Box>
      </Backdrop>
      
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default LoginPage;
