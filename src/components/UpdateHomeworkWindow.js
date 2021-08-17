import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { serverConfig } from '../config';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import InsertFileWindow from './InsertFileWindow';

const useStyles = makeStyles({
    body: {
        margin: 15,
        maxHeight: 500,
        // height: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: 20,
        marginRight: 20,
    },
    loadedFileIndicator: {
        borderRadius: '50%',
        width: 15,
        height: 15,
        backgroundColor: 'gray',
        alignSelf: 'center'
    }
});

const ARGS_TYPE_LIST = ["INT", "FLOAT", "STRING"]

const UpdateHomeworkWindow = (props) => {
    const classes = useStyles();
    const { onClose, stayOpened, open, currentHomework, updateHomework, isAddNewHomework, addNewHomework, classIdToName, classIds, updateCurrentHomework } = props;
    const [grade, setGrade] = useState(updateHomework.grade);

    const [name, setName] = useState('');
    const [classId, setClassId] = useState('');
    const [time, setTime] = useState('');
    const [argsType, setArgsType] = useState('');

    const [isExamQuestionLoaded, setIsExamQuestionLoaded] = useState(false);
    const [isExamSolutionLoaded, setIsExamSolutionLoaded] = useState(false);

    const [examQuestionData, setExamQuestionData] = useState(null);
    const [examSolutionData, setExamSolutionData] = useState(null);

    const [insertExamQuestionWindowOpen, setInsertExamQuestionWindowOpen] = useState(false);
    const [insertExamSolutionWindowOpen, setInsertExamSolutionWindowOpen] = useState(false);

    const handleClose = () => {
        setIsExamQuestionLoaded(false)
        setIsExamSolutionLoaded(false)
        onClose();
    };

    const submitFile = () => {
        let homeworkToUpdate = {}

        setIsExamQuestionLoaded(false)
        setIsExamSolutionLoaded(false)

        if (isAddNewHomework) {
            homeworkToUpdate = {
                ...currentHomework,
                name,
                classId,
                date: time,
                argsType
            }
            addNewHomework(homeworkToUpdate, examQuestionData, examSolutionData)
        } else {
            homeworkToUpdate = {
                ...currentHomework,
                grade
            }
            updateHomework(homeworkToUpdate);
        }
    };

    useEffect(() => {
    }, [])

    return (
        <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open} style={{ maxHeight: 800, overflow: 'hidden' }}>
            <DialogTitle id="dialog-title">
                {
                    !isAddNewHomework ?
                        "עדכון ציון:"
                        :
                        "יצירת מטלה:"
                }
            </DialogTitle>
            <Divider />
            <div className={classes.body}>
                {
                    !isAddNewHomework ?
                        <TextField
                            defaultValue={currentHomework.grade}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="grade"
                            type="number"
                            label="ציון"
                            name="grade"
                            autoFocus
                            onChange={e => {
                                setGrade(e.target.value)
                            }}
                        />
                        :
                        <React.Fragment>
                            <TextField
                                defaultValue={currentHomework.grade}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                type="text"
                                label="שם מטלה"
                                name="name"
                                autoFocus
                                onChange={e => {
                                    setName(e.target.value)
                                }}
                            />
                            <FormControl >
                                <InputLabel id="demo-customized-select-label">מקצוע</InputLabel>
                                <Select
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={classId}
                                    onChange={e => {
                                        setClassId(e.target.value)
                                    }}
                                >
                                    {
                                        classIds.length > 0 &&
                                        classIds.map((c, index) => {
                                            return <MenuItem key={`${c}-${index}`} value={c}>{classIdToName[c]}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <br />
                            <FormControl >
                                <InputLabel id="argsType-select-label">סוג הקלט</InputLabel>
                                <Select
                                    labelId="argsType-select-label"
                                    id="argsType-select"
                                    value={argsType}
                                    onChange={e => {
                                        setArgsType(e.target.value)
                                    }}
                                >
                                    {
                                        ARGS_TYPE_LIST.map((a, index) => {
                                            return <MenuItem key={`${a}-${index}`} value={a}>{a}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <br />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                <Typography
                                    component="h2"
                                    variant="h5"
                                    color="inherit"
                                    align="center"
                                    noWrap
                                    // className={classes.toolbarTitle}
                                    style={{ fontSize: 22, marginTop: 10 }}
                                >
                                    מועד אחרון להגשת המטלה:
                                </Typography>
                                <form className={classes.container} noValidate>
                                    <TextField
                                        id="datetime-local"
                                        type="datetime-local"
                                        className={classes.textField}
                                        InputLabelProps={{
                                        }}
                                        onChange={(e) => {
                                            setTime(new Date(e.target.value).toISOString().slice(0, 19).replace('T', ' '))
                                        }}
                                    />
                                </form>
                            </div>
                            <br />
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <Button onClick={() => {
                                    setInsertExamQuestionWindowOpen(true)
                                }} variant="contained" color="primary">
                                    קובץ תרגיל
                                </Button>
                                <div className={classes.loadedFileIndicator} style={{ backgroundColor: isExamQuestionLoaded ? 'green' : 'gray' }} ></div>
                                <Button onClick={() => {
                                    setInsertExamSolutionWindowOpen(true)
                                }} variant="contained" color="primary">
                                    קובץ פתרון
                                </Button>
                                <div className={classes.loadedFileIndicator} style={{ backgroundColor: isExamSolutionLoaded ? 'green' : 'gray' }}></div>
                            </div>
                            <br />
                        </React.Fragment>
                }
                <Button
                    variant="contained" color="primary"
                    onClick={() => submitFile()}
                    style={{ fontWeight: 'bold', marginTop: 20 }}
                >צור</Button>
            </div>
            <InsertFileWindow
                open={insertExamQuestionWindowOpen}
                onClose={() => setInsertExamQuestionWindowOpen(false)}
                id='exam-question'

                currentHomework={currentHomework}
                updateHomework={updateHomework}
                updateCurrentHomework={updateCurrentHomework}
                isExamQuestion={true}
                isExamSolution={false}
                addNewHomework={addNewHomework}
                callback={() => setIsExamQuestionLoaded(true)}
                setData={(data) => setExamQuestionData(data)}
            />
            <InsertFileWindow
                open={insertExamSolutionWindowOpen}
                onClose={() => setInsertExamSolutionWindowOpen(false)}
                id='exam-solution'

                currentHomework={currentHomework}
                updateHomework={updateHomework}
                updateCurrentHomework={updateCurrentHomework}
                isExamQuestion={false}
                isExamSolution={true}
                addNewHomework={addNewHomework}
                callback={() => setIsExamSolutionLoaded(true)}
                setData={(data) => setExamSolutionData(data)}
            />
        </Dialog>
    );
}

export default UpdateHomeworkWindow