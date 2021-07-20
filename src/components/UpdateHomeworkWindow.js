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
});

const UpdateHomeworkWindow = (props) => {
    const classes = useStyles();
    const { onClose, open, currentHomework, updateHomework, isAddNewHomework, addNewHomework, classIdToName, classIds } = props;
    const [grade, setGrade] = useState(updateHomework.grade);

    const [name, setName] = useState('');
    const [classId, setClassId] = useState('');
    const [time, setTime] = useState('');

    const handleClose = () => {
        onClose();
    };

    const submitFile = () => {
        let homeworkToUpdate = {}

        if (isAddNewHomework) {
            homeworkToUpdate = {
                ...currentHomework,
                name,
                classId,
                date: time
            }
            addNewHomework(homeworkToUpdate)
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
                                        console.log("🚀 ~ file: UpdateHomeworkWindow.js ~ line 114 ~ UpdateHomeworkWindow ~ e.target.value", e.target.value)
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
                                            console.log("🚀 ~ file: UpdateHomeworkWindow.js ~ line 163 ~ UpdateHomeworkWindow ~ new Date(e.target.value).toISOString().slice(0, 19).replace('T', ' ')", new Date(e.target.value).toISOString().slice(0, 19).replace('T', ' '))
                                            console.log("🚀 ~ file: UpdateHomeworkWindow.js ~ line 163 ~ UpdateHomeworkWindow ~ e.target.value", e.target.value)
                                        }}
                                    />
                                </form>
                            </div>
                            <br />
                        </React.Fragment>
                }
                <Button
                    variant="contained" color="primary"
                    onClick={() => submitFile()}
                    style={{ fontWeight: 'bold', marginTop: 20 }}
                >עדכן</Button>
            </div>
        </Dialog>
    );
}

export default UpdateHomeworkWindow