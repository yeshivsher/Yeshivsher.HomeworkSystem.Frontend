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

const AddClassWindow = (props) => {
    const classes = useStyles();
    const { onClose, stayOpened, open, classIdToName, classIds, teacherId, initAllClasses, setClassIds } = props;
    const [newClass, setNewClass] = useState('');
    const [newClassCredits, setNewClassCredits] = useState('');

    const handleClose = () => {
        onClose();
    };

    const submit = () => {
        addNewHomework()
    };

    const updateTeacherClasses = () => {
        let query = serverConfig.url + '/teacher/' + teacherId

        fetch(query, {
            method: 'get'
        })
            .then(data => data.json())
            .then(data => {
                let currentTeacher = JSON.parse(data.teacher)
                let classesOfCurrentTeacher = JSON.parse(currentTeacher.classIds)
                setClassIds(classesOfCurrentTeacher)

                console.log("🚀 ~ file: Homeworks.js ~ line 129 ~ addNewHomework ~ data", data)
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });

    };


    const addNewHomework = async () => {
        let query = serverConfig.url + '/classes'

        let body = {
            className: newClass,
            credits: newClassCredits,
            teacherId: teacherId
        }


        fetch(query, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
            .then(data => data.json()).then(data => {
                console.log("🚀 ~ file: Homeworks.js ~ line 129 ~ addNewHomework ~ data", data)
                initAllClasses()
                updateTeacherClasses()
            })
            .catch(e => {
                console.log("🚀 ~ file: HomeworkItem.js ~ line 73 ~ e", e)
            });


        onClose(false)
    };

    useEffect(() => {

    }, [])

    return (
        <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open} style={{ maxHeight: 800, overflow: 'hidden' }}>
            <DialogTitle id="dialog-title">
                יצירת מקצוע חדש
            </DialogTitle>
            <Divider />
            <div className={classes.body}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="class"
                    type="text"
                    label="מקצוע"
                    name="class"
                    autoFocus
                    onChange={e => {
                        setNewClass(e.target.value)
                    }}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="credits"
                    type="number"
                    label="נקודות זכות"
                    name="credits"
                    autoFocus
                    onChange={e => {
                        setNewClassCredits(e.target.value)
                    }}
                />
                <Button
                    variant="contained" color="primary"
                    onClick={() => submit()}
                    style={{ fontWeight: 'bold', marginTop: 20 }}
                >
                    צור
                </Button>
            </div>
        </Dialog>
    );
}

export default AddClassWindow