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
import Logo from '../images/logo.jpeg'

import { serverConfig } from '../config';
import { useHistory } from "react-router-dom"

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

async function loginUser(credentials, loginUserType) {
    return fetch(serverConfig.url + '/' + loginUserType + '/login?mail=' + credentials.email + '&password=' + credentials.password)
        .then(data => data.json()).then(data => {
            return data
        }).catch(e => {
            console.log("🚀 ~ file: login.js ~ line 86 ~ loginUser ~ e", e)
        })
}

export default function SignIn() {
    const classes = useStyles();
    const history = useHistory();

    const [isTeacher, setIsTeacher] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        const res = await loginUser({
            email,
            password 
        }, isTeacher ? 'teacher' : 'student');

        if (res?.isAuthenticated) {
            sessionStorage.setItem('isTeacher', JSON.stringify(isTeacher));
            sessionStorage.setItem('username', JSON.stringify(res.data.name + res.data.lastName));
            sessionStorage.setItem('userId', JSON.stringify(res.data.id));
            sessionStorage.setItem('token', JSON.stringify(res.token));

            history.replace("/app/home")
            // history.go(0)
        } else {
            window.alert("שם משתמש או סיסמא שגויים.")
        }
    }

    const validateEmail = email => {
        var regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regularExpression.test(String(email));
    };

    const validatePasswrod = password => {
        return password?.length > 2
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img src={Logo} alt="logo" className={classes.logo} />
                <Typography component="h1" variant="h5" style={{ fontWeight: 'bold' }}>
                    כניסה
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
                        name="password"
                        label="סיסמא"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={e => setPassword(e.target.value)}
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
                            !validatePasswrod(password)
                        }
                    >
                        כניסה
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/#/resetpassword" variant="body2">
                                שכחתי סיסמא
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/#/signup" variant="body2">
                                {"אין לך משתמש? הירשם."}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );

}