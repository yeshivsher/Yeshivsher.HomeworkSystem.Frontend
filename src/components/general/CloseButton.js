import React from 'react'
import { IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = theme => ({
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: '0px 5px 0px 0px',
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        }
    },
    rootCloseButton: {
        position: 'absolute',
        width: 10
    }
})

const CloseButton = (props) => {
    const { callback, classes } = props

    const handleClose = () => {
        callback()
    }

    return (
        <IconButton
            onClick={handleClose}
            className={classes.closeButton}
            classes={{
                label: classes.rootCloseButton
            }}
        >
            X
        </IconButton>
    )
}

export default withStyles(styles)(CloseButton)
