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
        justifyContent: 'center',
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
    const [displayFileWindowOpen, setDisplayFileWindowOpen] = useState(false);

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

        fetch(query, {
            method: "put",
            body: homeworkData,
        })
            .then(data => {
                setInsertFileWindowOpen(false)
                window.alert("הקובץ הועלה בהצלחה!")

                let queryForFile = serverConfig.url + '/homework/getFileByHomeworkId?homeworkId=' + currentHomework.id
                fetch(queryForFile, {
                    method: 'get',
                })
                    .then(response => response.json())
                    .then(data => {
                        // setFileContent(data.fileData)
                        initAllHomeworks()
                    })
                    .catch(err => {
                        console.error("TCL: registerLogic -> err", err)
                    })
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
        homeworkData.append('grade', homework.grade)
        homeworkData.append('studentId', homework.studentId)

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

    // useEffect(() => {
    //     console.log("🚀 ~ file: HomeworkItem.js ~ line 106 ~ useEffect ~ useEffect")

    // }, [fileContent])

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

    useEffect(() => {
        if (currentHomework.isFileExist) {
            getFileData()
        }
    }, [])

    useEffect(() => {
        if (currentHomework.isFileExist) {
            getFileData()
        }
    }, [fileContent])

    return (
        <div className={classes.root}>
            <Button onClick={() => {
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
            <InsertFileWindow
                open={insertFileWindowOpen}
                onClose={() => setInsertFileWindowOpen(false)}
                id={id}
                isFileExist={isFileExist}

                currentHomework={currentHomework}
                setHomeworkIdToFile={setHomeworkIdToFile}
                homeworkIdToFile={homeworkIdToFile}
                updateHomework={updateHomework}
                updateCurrentHomework={updateCurrentHomework}
            />
            <DisplayFileWindow open={displayFileWindowOpen} onClose={() => setDisplayFileWindowOpen(false)} content={fileContent} />
            <React.Fragment>
                {
                    !isTeacher &&
                    <Button
                        style={{ marginRight: 10 }}
                        onClick={() => {
                            console.log("🚀 ~ file: HomeworkItem.js ~ line 176 ~ fileContent", fileContent)
                            if (!fileContent) {
                                let query = serverConfig.url + '/homework/getFileByHomeworkId?homeworkId=' + currentHomework.id
                                fetch(query, {
                                    method: 'get',
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        setFileContent(data.fileData)
                                        if (data.fileData?.length < 100) {
                                            window.alert('ציונך הוא: 100')
                                            updateHomeworkWithoutFile({ ...currentHomework, grade: 100 })
                                        } else {
                                            window.alert('הבדיקה נכשלה.\nציונך הוא: 0.')
                                            updateHomeworkWithoutFile({ ...currentHomework, grade: 0 })
                                        }
                                    })
                                    .catch(err => {
                                        console.error("TCL: registerLogic -> err", err)
                                    })
                            } else {
                                if (fileContent?.length < 100) {
                                    window.alert('ציונך הוא: 100')
                                    updateHomeworkWithoutFile({ ...currentHomework, grade: 100 })
                                } else {
                                    window.alert('הבדיקה נכשלה.\nציונך הוא: 0.')
                                    updateHomeworkWithoutFile({ ...currentHomework, grade: 0 })
                                }
                            }
                        }}
                        variant="contained" color="primary">

                        בדוק
                    </Button>
                }
            </React.Fragment>

        </div>
    );
}

export default HomeworkItem