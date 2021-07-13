import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Routing from "./components/Routing/Routing"
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"

ReactDOM.render(
    <HashRouter>
      <Switch>
        <Routing />
      </Switch>
    </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
