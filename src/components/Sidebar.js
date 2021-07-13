import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const TEACHER = 'teacher'
const STUDENT = 'student'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        minHeight: 250,
        height: 250
    },
}));

export default function Sidebar(props) {
    const classes = useStyles();
    const { setSidebarController, setTableType, sidebarButtonsController } = props


    const studentsOrTeachers_handleClick = (newValue) => {
        let newValueToSet = newValue == 1 ? TEACHER : STUDENT
        setTableType(newValueToSet);
        setSidebarController(newValue)
    };

    const handleClick = (newValue) => {
        setSidebarController(newValue)
    };

    useEffect(function () {
        console.log('useEffect ')
    })

    return (
        <div className={classes.root}>
            {
                sidebarButtonsController.includes(1) &&
                <Button onClick={() => studentsOrTeachers_handleClick(1)} variant="contained" color="primary">
                    מורים
                </Button>
            }
            {
                sidebarButtonsController.includes(2) &&
                <Button onClick={() => studentsOrTeachers_handleClick(2)} variant="contained" color="primary">
                    סטודנטים
                </Button>
            }
            {
                sidebarButtonsController.includes(3) &&
                <Button onClick={() => studentsOrTeachers_handleClick(3)} variant="contained" color="primary">
                    מטלות
                </Button>
            }
            {/* {
                sidebarButtonsController.includes(4) &&
                <Button variant="contained" color="primary" href="#contained-buttons">
                    Link
                </Button>
            } */}
        </div>
    );
}
