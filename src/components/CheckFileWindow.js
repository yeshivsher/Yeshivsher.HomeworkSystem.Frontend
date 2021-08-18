import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { serverConfig } from '../config';

import DisplayFileWindow from './general/DisplayFileWindow';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
    body: {
        margin: 15
    },
});

const CheckFileWindow = (props) => {
    const classes = useStyles();
    const { onClose, open, id, isFileExist, setHomeworkIdToFile, homeworkIdToFile, isTeacher } = props;

    const [isFileReadyForSend, setIsFileReadyForSend] = useState(false);
    const [displayFileWindowOpen, setDisplayFileWindowOpen] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [fileForUpload, setFileForUpload] = useState(null);

    const upload = (file) => {
        let data = new FormData()
        data.append('file', file)

        fetch(serverConfig.url + '/homework', {
            method: 'POST',
            body: data 
        }).then(
            response => response.json() // if the response is a JSON object
        ).then(
            success => console.log(success) // Handle the success response object
        ).catch(
            error => console.log(error) // Handle the error response object
        );
    };

    const handleDisplayFileWindowClickOpen = () => {
        setDisplayFileWindowOpen(true);
    };

    const handleDisplayFileWindowClose = () => {
        setDisplayFileWindowOpen(false);
    };

    const handleClose = () => {
        onClose();
    };

    const submitFile = () => {
        upload(fileForUpload);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
            <DialogTitle id="dialog-title">
                העלאת קובץ
            </DialogTitle>
            <Divider />
            <div className={classes.body}>
                <Button onClick={() => alert('ימומש בחלק הבא')} variant="contained" color="primary" style={{ marginLeft: 10 }} disabled={!isFileReadyForSend}>
                    בדוק מטלה
                </Button>
                <Button onClick={() => handleDisplayFileWindowClickOpen()} variant="contained" color="primary" disabled={!isFileReadyForSend}>
                     הצג מטלה
                </Button>
                <DisplayFileWindow open={displayFileWindowOpen} onClose={handleDisplayFileWindowClose} content={fileContent} rtlDisplay={false}/>
            </div>
        </Dialog>
    );
}

export default CheckFileWindow