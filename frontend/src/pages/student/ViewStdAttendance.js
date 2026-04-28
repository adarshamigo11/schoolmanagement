import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography, TableContainer, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';

import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    // eslint-disable-next-line no-unused-vars
    if (response) { console.log(response) }
    // eslint-disable-next-line no-unused-vars
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <>
                <Typography variant={isMobile ? "h6" : "h4"} align="center" gutterBottom>
                    Attendance
                </Typography>
                <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 2 }}>
                    <Table size={isMobile ? "small" : "medium"}>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Sessions</StyledTableCell>
                                {!isMobile && <StyledTableCell>%</StyledTableCell>}
                                <StyledTableCell align="center">Details</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        {!isMobile && <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>}
                                        <StyledTableCell align="center">
                                            <Button 
                                                variant="contained"
                                                size={isMobile ? "small" : "medium"}
                                                onClick={() => handleOpen(subId)}
                                                sx={{ 
                                                    minWidth: isMobile ? 'auto' : undefined,
                                                    padding: isMobile ? '4px 8px' : undefined,
                                                    fontSize: isMobile ? '0.75rem' : undefined
                                                }}
                                            >
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                {!isMobile && "Details"}
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={isMobile ? 4 : 5}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: isMobile ? '0.9rem' : undefined }}>
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="attendance-details">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        }
                        )}
                    </Table>
                </TableContainer>
                <Typography variant="body1" sx={{ mb: isMobile ? 8 : 2, fontWeight: 600, textAlign: 'center' }}>
                    Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                </Typography>
            </>
        )
    }

    const renderChartSection = () => {
        return (
            <>
                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
            </>
        )
    };

    return (
        <>
            {loading
                ? (
                    <div>Loading...</div>
                )
                :
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ?
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Paper sx={{ 
                                position: 'fixed', 
                                bottom: 0, 
                                left: 0, 
                                right: 0, 
                                zIndex: 900 
                            }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                        :
                        <>
                            <Typography variant="h6" gutterBottom component="div">
                                Currently You Have No Attendance Details
                            </Typography>
                        </>
                    }
                </div>
            }
        </>
    )
}

export default ViewStdAttendance
