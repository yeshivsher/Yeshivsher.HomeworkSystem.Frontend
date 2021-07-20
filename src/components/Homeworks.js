import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import { getBase64 } from './general/helperFunctions';
import { serverConfig } from '../config';
import HomeworkItem from './HomeworkItem';
import UpdateHomeworkWindow from './UpdateHomeworkWindow';

const TEACHER = 'teacher'
const STUDENT = 'student'

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        maxHeight: 660,
        marginTop: 30,
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
    },
    rootTable: {
        width: '97%',
        textAlignLast: 'center',
        "&::-webkit-scrollbar": {
            width: "0.3em",
            backgroundColor: "aliceblue",
            borderRadius: 5
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#232c5f",
            color: '#232c5f',
            border: "solid",
            borderRadius: 5,
        },
    },
    rowTabs: {

        fontWeight: 'bold',
    },
    table: {
        minWidth: 650,
    },
    rowTitle: {
        fontWeight: 'bold',
        background: '#3f51b5',
        color: 'white'
    },
    rowItem: {
        fontWeight: 'bold',
    },
    addNewHomeworkButton: {
        position: 'absolute',
        bottom: 60,
        right: 60,
    },
});

const Homeworks = props => {
    const classes = useStyles();
    const { classIdToName, isTeacher, userId, classIds, getStudentsListByClassId, studentIdToName } = props
    const [listData, setListData] = useState([]);
    const [homeworkIdToFile, setHomeworkIdToFile] = useState({});
    const [homeworkIdToFileUpload, setHomeworkIdToFileUpload] = useState({});
    const [loaded, setLoaded] = useState(false)
    const [updateHomeworkWindowOpen, setUpdateHomeworkWindowOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(false);
    const [isAddNewHomework, setIsAddNewHomework] = useState(false);

    const updateHomeworkWithoutFile = async homework => {
        console.log("🚀 ~ file: Homeworks.js ~ line 64 ~ homework", homework)
        let query = serverConfig.url + '/homework/updateWithoutFile/' + homework.id
        let homeworkData = new FormData()

        homeworkData.append('name', homework.name)
        homeworkData.append('classId', homework.classId)
        homeworkData.append('status', homework.status)
        homeworkData.append('grade', homework.grade)
        homeworkData.append('studentId', homework.studentId)

        fetch(query, {
            method: "put",
            body: homeworkData,
        })
            .then(data => {
                setUpdateHomeworkWindowOpen(false)
                window.alert("הציון עודכן בהצלחה!")
                initAllHomeworks()
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });

    };


    const addNewHomework = async (newHomework) => {
        console.log("🚀 ~ file: Homeworks.js ~ line 64 ~ homework", newHomework)
        let query = serverConfig.url + '/homework'
        let studentList = getStudentsListByClassId(newHomework.classId)

        studentList.forEach(s => {
            console.log("🚀 ~ file: Homeworks.js ~ line 118 ~ addNewHomework ~ s", s)
            let homeworkData = new FormData()

            homeworkData.append('name', newHomework.name)
            homeworkData.append('classId', newHomework.classId)
            homeworkData.append('studentId', s.id)
            homeworkData.append('date', newHomework.date)

            fetch(query, {
                method: "post",
                body: homeworkData,
            })
                .then(data => {
                    console.log("🚀 ~ file: Homeworks.js ~ line 129 ~ addNewHomework ~ data", data)
                })
                .catch(e => {
                    console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
                });
        });

        initAllHomeworks()
        setUpdateHomeworkWindowOpen(false)
    };

    const updateCurrentHomework = async (newHomework) => {
        let tempHomeworkList = [...listData]
        let tempHomeworkIdToFile = { ...homeworkIdToFile }
        let currentId = newHomework.id

        for (let i in tempHomeworkList) {
            if (tempHomeworkList[i].id === currentId) {
                tempHomeworkList[i] = newHomework
                tempHomeworkIdToFile[currentId] = newHomework.fileData
            }
        }

        setHomeworkIdToFile(tempHomeworkIdToFile)
        setListData(tempHomeworkList)
    }

    const initAllHomeworks = () => {
        let queryT = isTeacher ? serverConfig.url + '/homework'
            : serverConfig.url + '/homework/byStudnetId?studentId=' + userId
        fetch(queryT, {
            method: 'get',
        })
            .then(response => response.json())
            .then(data => {
                let tempHomeworkList = []
                let tempHomeworkIdToFile = {}
                let homeworksList = JSON.parse(data.homeworks)

                homeworksList.forEach(element => {
                    let parsedElement = {
                        id: element.Id,
                        fileData: element.FileData,
                        name: element.Name,
                        classId: element.ClassId,
                        status: element.Status,
                        date: element.Date,
                        grade: element.Grade,
                        studentId: element.StudentId,
                        isFileExist: element.IsFileExist
                    }

                    tempHomeworkList.push(parsedElement)
                    tempHomeworkIdToFile[parsedElement.id] = parsedElement.fileData
                });
                console.log("🚀 ~ file: Homeworks.js ~ line 116 ~ initAllHomeworks ~ homeworksList", homeworksList)

                setHomeworkIdToFile(tempHomeworkIdToFile)
                setListData(tempHomeworkList)
                setLoaded(!(tempHomeworkList.length > 0))
            })
            .catch(err => {
                console.error("TCL: registerLogic -> err", err)
            })
    }

    useEffect(function () {
        console.log('useEffect')

        // get all data
        initAllHomeworks()
    }, [])

    return (
        <div className={classes.root}>
            {listData.length > 0 ?
                <TableContainer component={Paper} className={classes.rootTable}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.rowTitle} align="right">שם סטודנט</TableCell>
                                <TableCell className={classes.rowTitle}>שם מטלה</TableCell>
                                <TableCell className={classes.rowTitle} align="right">ציון</TableCell>
                                <TableCell className={classes.rowTitle} align="right">תאריך</TableCell>
                                <TableCell className={classes.rowTitle} align="right">מקצוע</TableCell>
                                <TableCell className={classes.rowTitle} align="right">מצב הגשה</TableCell>
                                <TableCell className={classes.rowTitle} align="right">הגשה</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                listData
                                    .filter(row => classIds.includes(row.classId))
                                    .map((row, index) => (
                                        <TableRow key={index + 'listdata-item'}>
                                            <TableCell className={classes.rowItem} align="right">{studentIdToName[row.studentId]}</TableCell>
                                            <TableCell className={classes.rowItem} component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell className={classes.rowItem} style={{ width: 50 }}>
                                                <div style={{ alignItems: 'center', display: 'flex', paddingRight: 30 }}>
                                                    <Fab
                                                        color="primary"
                                                        aria-label="edit"
                                                        onClick={() => {
                                                            setUpdateHomeworkWindowOpen(true)
                                                            setCurrentRow(row)
                                                            setIsAddNewHomework(false)
                                                        }}
                                                        style={{ marginRight: 20, height: 20, width: 30, display: isTeacher ? '' : 'none' }}
                                                    >
                                                        <EditIcon />
                                                    </Fab>
                                                    <Typography
                                                        component="h2"
                                                        color="inherit"
                                                        align="center"
                                                        noWrap
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: 'bold',
                                                            marginRight: 20,
                                                            color: row.grade == null ? 'gray' : row.grade > 59 ? 'green' : 'red'
                                                        }}
                                                    >
                                                        {row.grade == null ? 'אין ציון' : row.grade}
                                                    </Typography>
                                                </div>
                                            </TableCell>
                                            <TableCell className={classes.rowItem} align="right" style={{ width: 200 }}>
                                                {new Date(row.date).getFullYear() + '/' + (new Date(row.date).getMonth() + 1) + '/' + new Date(row.date).getDate()
                                                    + ' - ' + new Date(row.date).getHours() + ':' + new Date(row.date).getMinutes()}
                                            </TableCell>
                                            <TableCell className={classes.rowItem} align="right">{classIdToName[row.classId]}</TableCell>
                                            <TableCell className={classes.rowItem} align="right">{row.status}</TableCell>
                                            <TableCell className={classes.rowItem} align="right" style={{ width: 220 }}>
                                                <HomeworkItem
                                                    id={row.id}
                                                    isFileExist={homeworkIdToFile[row.id] != null}
                                                    setHomeworkIdToFile={setHomeworkIdToFile}
                                                    homeworkIdToFile={homeworkIdToFile}
                                                    setHomeworkIdToFileUpload={setHomeworkIdToFileUpload}
                                                    isTeacher={isTeacher}
                                                    currentHomework={row}
                                                    initAllHomeworks={initAllHomeworks}
                                                    updateCurrentHomework={updateCurrentHomework}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                :
                <div>
                    {
                        loaded ?
                            <Typography
                                component="h2"
                                variant="h5"
                                color="inherit"
                                align="center"
                                noWrap
                                style={{ margin: 20, fontSize: 30 }}
                            >
                                אין מטלות
                            </Typography> :
                            <CircularProgress style={{ width: 100, height: 100, alignSelf: 'center' }} />
                    }
                </div>
            }
            <UpdateHomeworkWindow
                open={updateHomeworkWindowOpen}
                onClose={() => setUpdateHomeworkWindowOpen(false)}

                currentHomework={currentRow}
                updateHomework={updateHomeworkWithoutFile}
                addNewHomework={addNewHomework}
                isAddNewHomework={isAddNewHomework}
                classIdToName={classIdToName}
                classIds={classIds}
            />
            {
                isTeacher &&
                <Fab
                    color="primary"
                    aria-label="edit"
                    onClick={() => {
                        setUpdateHomeworkWindowOpen(true)
                        setIsAddNewHomework(true)
                    }}
                    className={classes.addNewHomeworkButton}
                >
                    <AddIcon />
                </Fab>
            }
        </div>
    );
}

export default Homeworks