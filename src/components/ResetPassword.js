import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory } from "react-router-dom"
import Logo from '../images/logo.jpeg'

import { serverConfig } from '../config';
import useToken from './security/UseToken';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                Homework System
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    logo: {
        width: 120,
        boxShadow: '1px 1px 6px black',
        borderRadius: 5,
        marginBottom: 20
    },
}));

async function CheckNameAndMail(credentials, loginUserType) {
    return fetch(serverConfig.url + '/' + loginUserType + '/checknameandmail?mail=' + credentials.email + '&name=' + credentials.name)
        .then(data => data.json()).then(data => {
            return data
        }).catch(e => {
            console.log("🚀 ~ file: checknameandmail.js ~ line 86 ~ loginUser ~ e", e)
        })
}

async function ResetPasswordInvoker(object, loginUserType) {
    return fetch(serverConfig.url + '/' + loginUserType + '/resetpasswordbymail?mail=' + object.email + '&password=' + object.newPassword,
        {
            method: "put",
        })
        .then(data => data.json()).then(data => {
            return data
        }).catch(e => {
            console.log("🚀 ~ file: checknameandmail.js ~ line 86 ~ loginUser ~ e", e)
        })
}

export default function ResetPassword() {
    const classes = useStyles();
    const history = useHistory();
    const { token, setToken } = useToken();

    const [isTeacher, setIsTeacher] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        const res = await CheckNameAndMail({
            email,
            name
        }, isTeacher ? 'teacher' : 'student');

        if (res?.isAuthenticated) {
            window.alert("אימות בוצע בהצלחה.")
            setIsAuthenticated(true)
        } else {
            window.alert("שם פרטי או מייל שגויים.")
        }
    }
    const handleResetPassword = async e => {
        e.preventDefault();

        const res = await ResetPasswordInvoker({
            email,
            newPassword
        }, isTeacher ? 'teacher' : 'student');

        if (res?.isAuthenticated) {
            window.alert("איפוס בוצע בהצלחה.")

            sessionStorage.setItem('isTeacher', JSON.stringify(isTeacher));
            sessionStorage.setItem('username', JSON.stringify(res.data.name + ' ' + res.data.lastName));
            sessionStorage.setItem('userId', JSON.stringify(res.data.id));
            sessionStorage.setItem('classIds', JSON.stringify(res.data.classIds));
            sessionStorage.setItem('token', JSON.stringify(res.token));
      
            history.replace("/app/home")
        } else {
            window.alert("האיפוס נכשל.")
        }
    }

    const validateEmail = email => {
        var regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regularExpression.test(String(email));
    };

    const validateName = name => {
        return name?.length > 2
    };

    return (
        <Container component="main" maxWidth="xs">
            {!isAuthenticated ?
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{ fontWeight: 'bold' }}>
                        אימות לפני איפוס סיסמא
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="מייל"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={e => {
                                setEmail(e.target.value)
                                console.log(email)
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="name"
                            label="שם פרטי"
                            type="text"
                            id="name"
                            autoComplete="current-name"
                            onChange={e => setName(e.target.value)}
                        />
                        <ButtonGroup disableElevation variant="contained" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <Button
                                onClick={() => setIsTeacher(true)}
                                style={{ width: '50%', color: 'white', fontWeight: 'bold', background: isTeacher ? '#3f51b5' : '' }}
                            >מורה</Button>
                            <Button
                                onClick={() => setIsTeacher(false)}
                                style={{ width: '50%', color: 'white', fontWeight: 'bold', background: !isTeacher ? '#3f51b5' : '' }}
                            >תלמיד</Button>
                        </ButtonGroup>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}
                            disabled={
                                !validateEmail(email) ||
                                !validateName(name)
                            }
                        >
                            אמת
                        </Button>
                    </form>
                </div>
                :
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{ fontWeight: 'bold' }}>
                        איפוס סיסמא
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="סיסמא חדשה"
                            type="newPassword"
                            id="newPassword"
                            onChange={e => setNewPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleResetPassword}
                            disabled={
                                !validateName(newPassword)
                            }
                        >
                            אפס
                        </Button>
                    </form>
                </div>
            }
        </Container>
    );
}