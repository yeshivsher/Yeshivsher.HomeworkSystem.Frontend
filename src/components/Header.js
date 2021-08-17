import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Hebcal from 'hebcal';
import { useHistory } from "react-router-dom"
import Logo from '../images/logo.jpeg'

const HEADER_ELEMENTS_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    height: 120,
    justifyContent: 'space-between'
  },
  toolbarTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 50,
    fontFamily: 'system-ui',
    textShadow: '#ffffff 3px 3px 3px'
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
    fontWeight: 'bold',
    fontSize: 18,
    [theme.breakpoints.down("sm")]: {
      fontSize: 15,
      padding: 0
    },
  },
  logoContainer: {
    width: HEADER_ELEMENTS_WIDTH,
    [theme.breakpoints.down("sm")]: {
      display: 'none'
    },
  },
  logo: {
    width: 120,
    boxShadow: '1px 1px 6px black',
    borderRadius: 5,
  },
  leftHeader: {
    marginLeft: -13,
    marginTop: 15,
    width: HEADER_ELEMENTS_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  hebrewDate: {
    fontSize: 31,
    fontFamily: 'fantasy'
  }
}));

export default function Header(props) {
  const classes = useStyles();
  const history = useHistory();

  const { sections, title } = props;

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <img src={Logo} alt="logo" className={classes.logo} />
        </div>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        <div className={classes.leftHeader}>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            className={classes.hebrewDate}
          >
            {/* {new Hebcal.HDate().toString('h')} */}
            {new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate()}
          </Typography>
          <Button
            onClick={() => {
              sessionStorage.clear()
              console.log("Clear seesion storage")
              history.replace("/login")
            }}
            variant="contained"
            color="primary"
          >
            יציאה
          </Button>
        </div>
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
