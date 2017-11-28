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
require.context("../mock-data", true, /.*/);

const store = createStore(rootReducer,(sessionStorage.savedReduxState
  ? JSON.parse(sessionStorage.savedReduxState)
  : initialState),compose(applyMiddleware(thunk)));

window.onunload = function () {
  sessionStorage.savedReduxState = JSON.stringify(store.getState());
}

window.APP = {
  apiEndpoint : './' //important to end with /
};

window.onload = ()=>{
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
  );
}
