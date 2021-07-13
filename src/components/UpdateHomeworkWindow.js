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


const useStyles = makeStyles({
    body: {
        margin: 15
    },
});

const UpdateHomeworkWindow = (props) => {
    const classes = useStyles();
    const { onClose, open, currentHomework, updateHomework } = props;
    const [grade, setGrade] = useState(currentHomework.grade);

    const handleClose = () => {
        onClose();
    };

    const submitFile = () => {
        let homeworkToUpdate = {
            ...currentHomework,
            grade
        }

        updateHomework(homeworkToUpdate);
    };

    useEffect(() => {

    }, [])

    return (
        <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open} style={{ maxHeight: 800, overflow: 'hidden' }}>
            <DialogTitle id="dialog-title">
                עדכון ציון:
            </DialogTitle>
            <Divider />
            <div className={classes.body}>
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