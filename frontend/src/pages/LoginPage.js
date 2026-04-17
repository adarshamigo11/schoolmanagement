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
import Decorations3D from '../components/Decorations3D';
import '../styles/designSystem.css';

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
    <Box className="login-page" sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--void)'
    }}>
      <Decorations3D />
      
      {/* Left Side - Decorative */}
      <Box sx={{ 
        flex: 1, 
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{
          width: '120px',
          height: '120px',
          borderRadius: '24px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <SchoolIcon sx={{ fontSize: '64px', color: 'var(--t1)' }} />
        </Box>
        <Typography variant="h2" sx={{ 
          fontFamily: "'Playfair Display', serif",
          color: 'var(--t1)',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          School Management
        </Typography>
        <Typography variant="h5" sx={{ 
          color: 'var(--t3)',
          textAlign: 'center',
          maxWidth: '400px'
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
          padding: '24px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Paper elevation={0} sx={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--b2)',
          borderRadius: 'var(--radius-xl)',
          padding: { xs: '32px 24px', sm: '48px' },
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top accent line */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: role === 'Admin' ? 'var(--gradient-gold)' : 'var(--gradient-primary)'
          }} />

          <Box sx={{ textAlign: 'center', marginBottom: '32px' }}>
            <Typography variant="h4" sx={{ 
              fontFamily: "'Playfair Display', serif",
              color: 'var(--t1)',
              marginBottom: '8px',
              fontWeight: 600
            }}>
              {role} Login
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--t3)' }}>
              Welcome back! Please enter your details
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {role === "Student" ? (
              <>
                <TextField
                  className="input-premium"
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--t1)',
                      '& fieldset': { borderColor: 'var(--b1)' },
                      '&:hover fieldset': { borderColor: 'var(--b2)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--bright)' }
                    },
                    '& .MuiInputLabel-root': { color: 'var(--t3)' },
                    '& .MuiFormHelperText-root': { color: 'var(--gold2)' }
                  }}
                />
                <TextField
                  className="input-premium"
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--t1)',
                      '& fieldset': { borderColor: 'var(--b1)' },
                      '&:hover fieldset': { borderColor: 'var(--b2)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--bright)' }
                    },
                    '& .MuiInputLabel-root': { color: 'var(--t3)' },
                    '& .MuiFormHelperText-root': { color: 'var(--gold2)' }
                  }}
                />
              </>
            ) : (
              <TextField
                className="input-premium"
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
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--t1)',
                    '& fieldset': { borderColor: 'var(--b1)' },
                    '&:hover fieldset': { borderColor: 'var(--b2)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--bright)' }
                  },
                  '& .MuiInputLabel-root': { color: 'var(--t3)' },
                  '& .MuiFormHelperText-root': { color: 'var(--gold2)' }
                }}
              />
            )}
            
            <TextField
              className="input-premium"
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
                      sx={{ color: 'var(--t3)' }}
                    >
                      {toggle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--t1)',
                  '& fieldset': { borderColor: 'var(--b1)' },
                  '&:hover fieldset': { borderColor: 'var(--b2)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--bright)' }
                },
                '& .MuiInputLabel-root': { color: 'var(--t3)' },
                '& .MuiFormHelperText-root': { color: 'var(--gold2)' }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="#" style={{ color: 'var(--sky)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Forgot password?
              </Link>
            </Box>

            <button
              type="submit"
              className="btn-premium"
              style={{ marginTop: '8px' }}
            >
              {loader ? (
                <CircularProgress size={24} sx={{ color: 'var(--t1)' }} />
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={guestModeHandler}
              className="btn-outline"
            >
              {guestLoader ? (
                <CircularProgress size={20} sx={{ color: 'var(--t1)' }} />
              ) : (
                "Login as Guest"
              )}
            </button>

            {role === "Admin" && (
              <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                <Typography variant="body2" sx={{ color: 'var(--t3)' }}>
                  Don't have an account?{' '}
                  <Link to="/Adminregister" style={{ color: 'var(--sky)', textDecoration: 'none', fontWeight: 600 }}>
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
          background: 'rgba(11, 15, 26, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
        open={guestLoader}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'var(--bright)', marginBottom: '16px' }} />
          <Typography sx={{ color: 'var(--t1)' }}>Please Wait...</Typography>
        </Box>
      </Backdrop>
      
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default LoginPage;
