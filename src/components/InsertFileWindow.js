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

const useStyles = makeStyles({
    body: {
        margin: 15
    },
});

const InsertFileWindow = (props) => {
    const classes = useStyles();
    const { onClose, open, id, currentHomework, setHomeworkIdToFile, homeworkIdToFile, updateHomework } = props;

    const [isFileReadyForSend, setIsFileReadyForSend] = useState(false);
    const [isFileExist, setIsFileExist] = useState(false);
    const [displayFileWindowOpen, setDisplayFileWindowOpen] = useState(false);
    const [fileContent, setFileContent] = useState(null);
    const [fileForUpload, setFileForUpload] = useState(null);

    const showFile = () => {
        try {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var file = document.querySelector('input[type=file]').files[0];
                var textFile = /text.*/;
                var reader = new FileReader()

                // set data
                let tempHomeworkIdToFile = { ...homeworkIdToFile }

                tempHomeworkIdToFile[id] = file

                setHomeworkIdToFile(tempHomeworkIdToFile)
                setIsFileReadyForSend(true)

                if (file != null) {
                    if (file.type === 'text/x-python') {
                        reader.onload = function (event) {
                            // preview.innerHTML = event.target.result;
                            setFileContent(event.target.result)
                        }

                        reader.readAsText(file);
                    } else {
                        alert("לא ניתן לטעון קובץ שאינו עם סיומת .py");
                        onClose();
                    }
                }
            } else {
                alert("Your browser is too old to support HTML5 File API");
            }

            setFileForUpload(file)
        } catch (e) {

            console.log("🚀 ~ file: HomeworkItem.js ~ line 84 ~ e", e)
        }
    }

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
        let currentDate = new Date()

        if (currentDate.getTime() < new Date(currentHomework.date).getTime()) {
            let homeworkToUpdate = {
                ...currentHomework,
                fileData: fileForUpload,
                isFileExist: true
            }

            updateHomework(homeworkToUpdate);
        } else {
            window.alert('לא ניתן להגיש - עבר תאריך ההגשה.')
        }
    };

    useEffect(() => {

        if (currentHomework.isFileExist == 1) {
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
    }, [])

    return (
        <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
            <DialogTitle id="dialog-title">
                קובץ מטלה
            </DialogTitle>
            <Divider />
            <div className={classes.body}>
                <input id={`file-${id}`} type="file" name={`file-${id}`} onChange={showFile} />
                <Button onClick={() => submitFile()} variant="contained" color="primary" style={{ marginLeft: 10 }} disabled={!isFileReadyForSend}>
                    הגש
                </Button>
                <Button onClick={() => {
                    if (currentHomework.isFileExist) { handleDisplayFileWindowClickOpen() }
                }} variant="contained" color="primary" disabled={!isFileReadyForSend && !currentHomework.isFileExist}>
                    הצג
                </Button>
                <DisplayFileWindow open={displayFileWindowOpen} onClose={handleDisplayFileWindowClose} content={fileContent} />
            </div>
        </Dialog>
    );
}

export default InsertFileWindow