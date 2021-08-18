import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

const DisplayFileWindow = (props) => {
    const classes = useStyles();
    const { onClose, open, content, rtlDisplay } = props;
    console.log("🚀 ~ file: DisplayFileWindow.js ~ line 20 ~ DisplayFileWindow ~ rtlDisplay", rtlDisplay)

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
            <DialogTitle id="dialog-title">
                תוכן הקובץ
            </DialogTitle>
            <Divider />
            <Typography
                component="h1"
                variant="body1"
                color="inherit"
                align="center"
                noWrap
                style={{ padding: 10, whiteSpace: 'normal', overflow: 'auto', textAlign: rtlDisplay ? 'right' : 'left', whiteSpace: 'pre-line', fontWeight: 'bold' }}
            >
                {content}
            </Typography>
        </Dialog>
    );
}

export default DisplayFileWindow