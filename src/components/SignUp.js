import React, { useEffect, useState } from 'react';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  logo: {
    width: 120,
    boxShadow: '1px 1px 6px black',
    borderRadius: 5,
    marginBottom: 20
  },
}));

async function signupUser(credentials, loginUserType) {
  let body = {
    name: credentials.name,
    lastName: credentials.lastName,
    password: credentials.password,
    classIds: credentials.classIds,
    mail: credentials.mail
  }

  return fetch(serverConfig.url + '/' + loginUserType, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(data => data.json()).then(data => {
      return data
    }).catch(e => {
      console.log("🚀 ~ file: login.js ~ line 86 ~ loginUser ~ e", e)
    })
}


export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();

  const [isTeacher, setIsTeacher] = useState(true);
  const [classesList, setClassesList] = useState([]);
  const [classesSelctedList, setClassesSelctedList] = useState([]);
  const [classesIdToObject, setClassesIdToObject] = useState({});
  const [signupObject, setSignupObject] = useState({
    name: '',
    lastName: '',
    password: '',
    classIds: '',
    mail: ''
  });

  const handleChange_classesSelectionList = (id) => {
    let tempClassesIdToObject = { ...classesIdToObject }
    let tempClassesSelctedList = []
    tempClassesIdToObject[id].selected = !classesIdToObject[id].selected

    for (let c in tempClassesIdToObject) {
      if (tempClassesIdToObject[c].selected) {
        tempClassesSelctedList.push(tempClassesIdToObject[c].id)
      }
    }

    setClassesIdToObject(tempClassesIdToObject)
    setClassesSelctedList(tempClassesSelctedList)

    setSignupObject({
      ...signupObject,
      classIds: '[' + tempClassesSelctedList.toString() + ']',
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await signupUser({
      name: signupObject.name,
      lastName: signupObject.lastName,
      password: signupObject.password,
      classIds: signupObject.classIds,
      mail: signupObject.mail
    }, isTeacher ? 'teacher' : 'student');

    console.log("🚀 ~ file: SignUp.js ~ line 157 ~ SignUp ~ res", res)
    if (res.success) {
      let userObject = JSON.parse(res.data)
      sessionStorage.setItem('isTeacher', JSON.stringify(isTeacher));
      sessionStorage.setItem('username', JSON.stringify(userObject.name + ' ' + userObject.lastName));
      sessionStorage.setItem('userId', JSON.stringify(userObject.id));
      sessionStorage.setItem('classIds', JSON.stringify(userObject.classIds));
      sessionStorage.setItem('token', JSON.stringify(res.token));

      history.replace("/app/home")
    } else {
      window.alert("השרת לא הצליח לרשום אותך במערכת.")
    }
  }

  const handleChange = name => event => {
    setSignupObject({
      ...signupObject,
      [name]: event.target.value,
    })
  }

  useEffect(function () {
    console.log('useEffect')

    let query = serverConfig.url + '/classes'
    fetch(query, {
      method: 'get',
    })
      .then(response => response.json())
      .then(data => {
        let tempClass
        let tempClassesList = []
        let tempClassesIdToObject = {}

        data.classes.map(c => {
          tempClass = JSON.parse(c)
          tempClassesIdToObject[tempClass.id] = { ...tempClass, selected: false }
          tempClassesList.push(tempClass.id)
        })

        setClassesList(tempClassesList)
        setClassesIdToObject(tempClassesIdToObject)
      })
      .catch(err => {
        console.error("TCL: registerLogic -> err", err)
      })
  }, [])

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
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <img src={Logo} alt="logo" className={classes.logo} />
        <Typography component="h1" variant="h5" style={{ fontWeight: 'bold' }}>
          רישום
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="שם פרטי"
                autoFocus
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="שם משפחה"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="מייל"
                name="email"
                onChange={handleChange('mail')}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="סיסמא"
                type="password"
                id="password"
                onChange={handleChange('password')}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Typography style={{ fontSize: 20 }}>
                בחר מקצועות:
              </Typography>
              <List className={classes.root} subheader={<li />}>
                {
                  classesList.length > 0 && Object.keys(classesIdToObject).length > 0 &&
                  classesList.map(c => {
                    return (
                      <ListItem key={"item-" + classesIdToObject[c].id}>
                        <ListItemText primary={classesIdToObject[c].className} style={{ textAlign: 'right' }} />
                        <Checkbox
                          checked={classesIdToObject[c].selected}
                          onChange={() => {
                            handleChange_classesSelectionList(c)
                          }}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                      </ListItem>
                    )
                  })
                }
              </List>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={
              !validateEmail(signupObject.mail) ||
              !validatePasswrod(signupObject.password)
            }
          >
            הירשם
          </Button>
          <Grid container justifycontent="flex-end">
            <Grid item>
              <Link href="/#/login" variant="body2">
                כבר רשום?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}