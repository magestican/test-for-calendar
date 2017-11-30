import React from 'react';
import ReactDOM from 'react-dom';
require('./index.html');
require('./styles/main.scss');
import App from './components/app';
import { Provider } from 'react-redux'
import { createStore ,compose,applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducer/rootReducer';
import {initialState} from './reducer/initialState';
import 'semantic-ui-css/semantic.min.css';
import moment from 'moment'
require.context("../mock-data", true, /.*/);

const store = createStore(rootReducer,(sessionStorage.savedReduxState
  ? JSON.parse(sessionStorage.savedReduxState)
  : initialState),compose(applyMiddleware(thunk)));

window.onunload = function () {
  sessionStorage.savedReduxState = JSON.stringify(store.getState());
}


function extractUrlValue(key)
{
    let url = window.location.href;
    let match = url.match('[?&]' + key + '=([^&]+)');
    return match ? match[1] : null;
}

let apiEndpoint = extractUrlValue('apiendpoint');
let activityLog = extractUrlValue('activitylog');

console.log(apiEndpoint);
console.log(activityLog);
if (!window.ActivityAPP){
  window.ActivityAPP = {
    apiEndpoint : (apiEndpoint || './'),//important to end with /
    apis: {
      activityLog : (activityLog || 'activityLog.json')
    }
  };
}


window.onload = ()=>{
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
  );
}
