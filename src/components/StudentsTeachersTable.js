import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const TEACHER = 'teacher'
const STUDENT = 'student'

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        maxHeight: 660,
        marginTop: 30,
        flexDirection: 'column',
        zIndex: 10,
        alignItems: 'center'
    },
    rootTable: {
        width: '97%',
        textAlignLast: 'center',
        "&::-webkit-scrollbar": {
            width: "0.3em",
            backgroundColor: "aliceblue",
            borderRadius: 5
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#232c5f",
            color: '#232c5f',
            border: "solid",
            borderRadius: 5,
        },
    },
    tabs: {
        maxHeight: 47,
        width: 322,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
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
    rowItem: {
        fontWeight: 'bold',
    },
});

const StudentsTeachersTable = props => {
    const classes = useStyles();
    const { tableTypeName, listData, classIdToName, getClassesNamesList } = props


    return (
        <div className={classes.root}>
            <TableContainer component={Paper} className={classes.rootTable}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.rowTitle}> שם {tableTypeName}  </TableCell>
                            <TableCell className={classes.rowTitle} align="right">שם משפחה</TableCell>
                            <TableCell className={classes.rowTitle} align="right">מייל</TableCell>
                            <TableCell className={classes.rowTitle} style={{ width: 700 }} align="right">מקצועות</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listData.map((row, index) => (
                            <TableRow key={index + 'listdata-item'}>
                                <TableCell className={classes.rowItem} component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell className={classes.rowItem} align="right">{row.lastName}</TableCell>
                                <TableCell className={classes.rowItem} align="right">{row.mail}</TableCell>
                                <TableCell className={classes.rowItem} align="right">
                                    {getClassesNamesList(row.classIds)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default StudentsTeachersTable