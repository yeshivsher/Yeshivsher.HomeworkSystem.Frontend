import React, { useEffect } from "react";
import { HashRouter, Route, Switch, Redirect, withRouter } from "react-router-dom"


// styles
import useStyles from "./styles";

// pages
import Home from "../Home";
import SignUp from "../SignUp";
import Login from "../Login";
import ResetPassword from '../ResetPassword';
import { useHistory } from "react-router-dom"

import useToken from '../security/UseToken';


// context

function Routing(props) {


  useEffect(() => {
    console.log("Routing.js useEffect")
  }, [])

  if (!sessionStorage.getItem('token')) {
    return (
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/resetpassword" component={ResetPassword} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route path="/#/" render={() => <Redirect to="/login" />} />
        <Route path="/" render={() => <Redirect to="/login" />} />
      </Switch>
    );
  }

  // global
  return (
    <Switch>
      <Route path="/app/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route exact path="/" render={() => <Redirect to="/app/home" />} />
      <Route path="/#/" render={() => <Redirect to="/app/home" />} />
    </Switch>
  );
}

export default withRouter(Routing);
