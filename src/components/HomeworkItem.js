import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import InsertFileWindow from './InsertFileWindow';
import { getBase64 } from './general/helperFunctions';
import { serverConfig } from '../config';
import DisplayFileWindow from './general/DisplayFileWindow';

const TEACHER = 'teacher'
const STUDENT = 'student'

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        maxHeight: 400,
        flexDirection: 'column',
        alignItems: 'center',
        flexDirection: 'row'
    },
    rootTable: {
        width: '97%',
        textAlignLast: 'center',
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
});

const HomeworkItem = props => {
    const classes = useStyles();
    const { id, isFileExist, setHomeworkIdToFile, homeworkIdToFile, isTeacher, currentHomework, initAllHomeworks, updateCurrentHomework } = props

    const [insertFileWindowOpen, setInsertFileWindowOpen] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [examQuestionContent, setExamQuestionContent] = useState(null);
    const [displayFileWindowOpen, setDisplayFileWindowOpen] = useState(false);
    const [displayExamQuestionWindowOpen, setDisplayExamQuestionWindowOpen] = useState(false);
    const [rtlDisplay, setRtlDisplay] = useState(false);

    const updateHomework = async homework => {
        console.log("🚀 ~ file: HomeworkItem.js ~ line 50 ~ homework", homework)
        let query = serverConfig.url + '/homework/' + homework.id
        let homeworkData = new FormData()

        homeworkData.append('fileData', homework.fileData)
        homeworkData.append('name', homework.name)
        homeworkData.append('classId', homework.classId)
        homeworkData.append('status', homework.status)
        homeworkData.append('grade', homework.grade)
        homeworkData.append('studentId', homework.studentId)
        homeworkData.append('isFileExist', homework.isFileExist)
        homeworkData.append('argsType', homework.argsType)
        homeworkData.append('isExam', homework.isExam)
        homeworkData.append('examId', homework.examId)

        fetch(query, {
            method: "put",
            body: homeworkData,
        })
            .then(data => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 71 ~ data", data)
                setInsertFileWindowOpen(false)
                window.alert("הקובץ הועלה בהצלחה!")

                let queryForFile = serverConfig.url + '/homework/getFileByHomeworkId?homeworkId=' + currentHomework.id

                fetch(queryForFile, {
                    method: 'get',
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("🚀 ~ file: HomeworkItem.js ~ line 80 ~ data", data)
                        // setFileContent(data.fileData)
                    })
                    .catch(err => {
                        console.error("TCL: registerLogic -> err", err)
                    })

                initAllHomeworks()
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });
    };

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

        console.log("🚀 ~ file: HomeworkItem.js ~ line 117 ~ homeworkData", homeworkData)
        fetch(query, {
            method: "put",
            body: homeworkData,
        })
            .then(data => {
                initAllHomeworks()
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });

    };

    const getFileData = () => {
        let query = serverConfig.url + '/homework/getFileByHomeworkId?homeworkId=' + currentHomework.id
        fetch(query, {
            method: 'get',
        })
            .then(response => response.json())
            .then(data => {
                setFileContent(data.fileData)
            })
            .catch(err => {
                console.error("TCL: registerLogic -> err", err)
            })
    }

    const getExamQuestionByHomeworkId = () => {
        let query = serverConfig.url + '/homework/getExamQuestionByHomeworkId?homeworkId=' + currentHomework.examId
        fetch(query, {
            method: 'get',
        })
            .then(response => response.json())
            .then(data => {
                setExamQuestionContent(data.fileData)
            })
            .catch(err => {
                console.error("TCL: registerLogic -> err", err)
            })
    }

    useEffect(() => {
        if (currentHomework.isFileExist) {
            getFileData()
        }

        if (examQuestionContent == null) {
            getExamQuestionByHomeworkId()
        }
    }, [])

    useEffect(() => {
        if (currentHomework.isFileExist) {
            getFileData()
        }

        if (examQuestionContent == null) {
            getExamQuestionByHomeworkId()
        }
    }, [fileContent])

    return (
        <div className={classes.root}>
            <Button onClick={() => {
                setRtlDisplay(false)
                if (isTeacher) {
                    if (currentHomework.isFileExist) {
                        setDisplayFileWindowOpen(true)
                    } else {
                        window.alert('לא הוזן / הוגש קובץ')
                    }
                } else {
                    setInsertFileWindowOpen(true)
                }

            }} variant="contained" color="primary">
                {
                    isTeacher ?
                        "הצג"
                        :
                        "קובץ מטלה"
                }
            </Button>
            <Button
                onClick={() => {
                    console.log("🚀 ~ file: HomeworkItem.js ~ line 194 ~ examQuestionContent", examQuestionContent)
                    if (examQuestionContent != null) {
                        setDisplayExamQuestionWindowOpen(true)
                        setRtlDisplay(true)
                    }
                }}
                variant="contained"
                color="primary">
                {
                    isTeacher ?
                        "הצג תרגיל"
                        :
                        "קובץ תרגיל"
                }
            </Button>
            <InsertFileWindow
                open={insertFileWindowOpen}
                onClose={() => {
                    setRtlDisplay(false)
                    setInsertFileWindowOpen(false)
                }}
                id={id}
                isFileExist={isFileExist}

                currentHomework={currentHomework}
                updateHomework={updateHomework}
                updateCurrentHomework={updateCurrentHomework}
                isExamSolution={false}
                isExamQuestion={false}
            />
            <DisplayFileWindow open={displayFileWindowOpen} onClose={() => setDisplayFileWindowOpen(false)} content={fileContent} rtlDisplay={rtlDisplay} />
            <DisplayFileWindow open={displayExamQuestionWindowOpen} onClose={() => setDisplayExamQuestionWindowOpen(false)} content={examQuestionContent} rtlDisplay={rtlDisplay} />
            <React.Fragment>
                {
                    !isTeacher &&
                    <Button
                        style={{ marginRight: 10 }}
                        onClick={() => {
                            let query = serverConfig.url + '/homework/pythonCodeCheckerByHomeworkId?homeworkId=' + currentHomework.id

                            fetch(query, {
                                method: 'get',
                            })
                                .then(response => response.json())
                                .then(data => {
                                    updateHomeworkWithoutFile({ ...currentHomework, grade: data.grade })
                                })
                                .catch(err => {
                                    console.error("TCL: registerLogic -> err", err)
                                })
                        }}
                        disabled={currentHomework.status === 'לא הוגש'}
                        variant="contained" color="primary">

                        בדוק
                    </Button>
                }
            </React.Fragment>

        </div>
    );
}

export default HomeworkItem