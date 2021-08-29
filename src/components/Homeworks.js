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
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

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
    searchContainer: {
        width: '97%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    search: {
        position: 'relative',
        borderRadius: 5,
        backgroundColor: "#869bb4",
        '&:hover': {
            // backgroundColor: "blue",
        },
        marginLeft: 0,
        width: '93%',
        marginBottom: 10
    },
    searchIcon: {
        padding: 10,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'white',
        width: '100%',
        marginRight: 40
    },
    inputInput: {
        padding: 10,
        paddingLeft: 50,
        transition: 'width 2s',
        width: '100%',
    },
});

const Homeworks = props => {
    const classes = useStyles();
    const { classIdToName, isTeacher, userId, classIds, getStudentsListByClassId, studentIdToName } = props
    const [listData, setListData] = useState([]);
    const [filteredListData, setFilteredListData] = useState(null);
    const [homeworkIdToFile, setHomeworkIdToFile] = useState({});
    const [homeworkIdToFileUpload, setHomeworkIdToFileUpload] = useState({});
    const [loaded, setLoaded] = useState(false)
    const [updateHomeworkWindowOpen, setUpdateHomeworkWindowOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(false);
    const [isAddNewHomework, setIsAddNewHomework] = useState(false);
    const [homeworkSearchWord, setHomeworkSearchWord] = useState('');

    const updateHomeworkWithoutFile = async homework => {
        console.log("🚀 ~ file: Homeworks.js ~ line 64 ~ homework", homework)
        let query = serverConfig.url + '/homework/updateWithoutFile/' + homework.id

        let homeworkData = new FormData()
        homeworkData.append('name', homework.name)
        homeworkData.append('classId', homework.classId)
        homeworkData.append('status', homework.status)
        homeworkData.append('grade', Number(homework.grade))
        homeworkData.append('studentId', homework.studentId)
        homeworkData.append('argsType', homework.argsType)
        homeworkData.append('isExam', homework.isExam)
        homeworkData.append('examId', homework.examId)

        fetch(query, {
            method: "put",
            body: homeworkData,
        })
            .then(data => {
                console.log("🚀 ~ file: Homeworks.js ~ line 102 ~ data", data)
                setUpdateHomeworkWindowOpen(false)
                window.alert("הציון עודכן בהצלחה!")
                initAllHomeworks()
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });

    };


    const addNewHomework = async (newHomework, examQuestionData, examSolutionData) => {
        console.log("🚀 ~ file: Homeworks.js ~ line 64 ~ homework", newHomework)
        let query = serverConfig.url + '/homework/addExam'
        let studentList = getStudentsListByClassId(newHomework.classId)
        let homeworkDataForExam = new FormData()

        homeworkDataForExam.append('name', newHomework.name)
        homeworkDataForExam.append('classId', newHomework.classId)
        homeworkDataForExam.append('isExam', 1)
        homeworkDataForExam.append('examQuestion', examQuestionData)
        homeworkDataForExam.append('examSolution', examSolutionData)
        homeworkDataForExam.append('date', newHomework.date)
        homeworkDataForExam.append('argsType', newHomework.argsType)

        fetch(query, {
            method: 'post',
            body: homeworkDataForExam,
        })
            .then(data => {
                console.log("🚀 ~ file: Homeworks.js ~ line 129 ~ addNewHomework ~ data", data)
                initAllHomeworks()
                window.alert("המטלה הוספה בהצלחה!")
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });


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
        console.log("🚀 ~ file: Homeworks.js ~ line 181 ~ updateCurrentHomework ~ tempHomeworkList", tempHomeworkList)

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
                console.log("🚀 ~ file: Homeworks.js ~ line 169 ~ initAllHomeworks ~ data", data)
                let tempHomeworkList = []
                let tempHomeworkIdToFile = {}
                let homeworksList = JSON.parse(data.homeworks)

                homeworksList.forEach(element => {
                    if (!element.IsExam) {
                        let parsedElement = {
                            id: element.Id,
                            fileData: element.FileData,
                            name: element.Name,
                            classId: element.ClassId,
                            status: element.Status,
                            date: element.Date,
                            grade: element.Grade,
                            studentId: element.StudentId,
                            isFileExist: element.IsFileExist,
                            argsType: element.ArgsType,
                            isExam: element.IsExam,
                            examId: element.ExamId
                        }

                        tempHomeworkList.push(parsedElement)
                        tempHomeworkIdToFile[parsedElement.id] = parsedElement.fileData
                    }
                });
                console.log("🚀 ~ file: Homeworks.js ~ line 116 ~ initAllHomeworks ~ homeworksList", homeworksList)

                setHomeworkIdToFile(tempHomeworkIdToFile)
                setListData(tempHomeworkList)
                setLoaded(!(tempHomeworkList.length > 0))
                setFilteredListData(tempHomeworkList)
            })
            .catch(err => {
                console.error("TCL: registerLogic -> err", err)
            })
    }

    const handleHomeworkSearchChange = () => {
        let filteredList = []
        filteredList = listData.filter(homework =>
            homework.name.includes(homeworkSearchWord))
        console.log("🚀 ~ file: Homeworks.js ~ line 246 ~ handleHomeworkSearchChange ~ filteredList", filteredList)

        setFilteredListData([...filteredList])
    }

    const handleStudentSearchClick = (id) => {
        let filteredList = []
        filteredList = listData.filter(homework =>
            homework.studentId === id)
        console.log("🚀 ~ file: Homeworks.js ~ line 246 ~ handleHomeworkSearchChange ~ filteredList", filteredList)

        setFilteredListData([...filteredList])
    }

    useEffect(function () {
        console.log('useEffect')

        // get all data
        initAllHomeworks()
    }, [])

    useEffect(function () {
        console.log('useEffect filteredListData')
    }, [filteredListData])

    return (
        <div className={classes.root}>
            <div className={classes.searchContainer}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        onChange={(e) => {
                            setHomeworkSearchWord(e.target.value)
                        }}
                        placeholder="חיפוש מטלה…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>
                <Button
                    style={{ height: 38, background: '#4864ff', color: 'white' }}
                    onClick={handleHomeworkSearchChange}
                    variant="contained"
                    color="primary"
                >
                    חפש
                </Button>
            </div>
            {Array.isArray(filteredListData) && filteredListData.length > 0 ?
                <>
                    <p>{"מספר תוצאות: " + filteredListData.length}</p>
                    <TableContainer component={Paper} className={classes.rootTable}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.rowTitle} align="right"
                                        style={{
                                            cursor: 'pointer',
                                            textShadow: '0px 0px 12px rgb(0 0 0)',
                                            width: 150
                                        }}
                                        onClick={(e) => {
                                            setFilteredListData(listData)
                                        }}
                                    >שם סטודנט</TableCell>
                                    <TableCell className={classes.rowTitle} >שם מטלה</TableCell>
                                    <TableCell className={classes.rowTitle} align="right">ציון</TableCell>
                                    <TableCell className={classes.rowTitle} align="right">תאריך</TableCell>
                                    <TableCell className={classes.rowTitle} align="right">מקצוע</TableCell>
                                    <TableCell className={classes.rowTitle} align="right">סוג קלט</TableCell>
                                    <TableCell className={classes.rowTitle} align="right">מצב הגשה</TableCell>
                                    <TableCell className={classes.rowTitle} align="right">הגשה</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    filteredListData
                                        .filter(row => classIds.includes(row.classId) && !row.isExam)
                                        .map((row, index) => (
                                            <TableRow key={index + 'listdata-item'}>
                                                <TableCell
                                                    style={{
                                                        cursor: 'pointer',
                                                        textShadow: '0px 0px 12px #3f51b5',
                                                        width: 170
                                                    }}
                                                    onClick={(e) => {
                                                        handleStudentSearchClick(row.studentId)
                                                    }}
                                                    className={classes.rowItem} align="right">{studentIdToName[row.studentId]}</TableCell>
                                                <TableCell style={{ width: 120 }} className={classes.rowItem} component="th" scope="row">
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
                                                            style={{ height: 20, width: 35, display: isTeacher ? '' : 'none' }}
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
                                                <TableCell className={classes.rowItem} style={{ width: 120 }} align="right">{classIdToName[row.classId]}</TableCell>
                                                <TableCell className={classes.rowItem} align="right">{row.argsType}</TableCell>
                                                <TableCell className={classes.rowItem} align="right">{row.status}</TableCell>
                                                <TableCell className={classes.rowItem} align="right" style={{ width: 375 }}>
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
                </>
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
                onClose={() => {
                    setUpdateHomeworkWindowOpen(false)
                    console.log('onClose')
                }}
                stayOpened={() => {
                    setUpdateHomeworkWindowOpen(true)
                    console.log('stayOpened')
                }}

                currentHomework={currentRow}
                updateHomework={updateHomeworkWithoutFile}
                addNewHomework={addNewHomework}
                isAddNewHomework={isAddNewHomework}
                classIdToName={classIdToName}
                classIds={classIds}
                updateCurrentHomework={updateCurrentHomework}
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