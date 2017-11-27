import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getActivityLog} from '../actions/activityLog'
import { connect } from 'react-redux'
import Draggable from 'react-draggable';
import ActivityLog from './activityLog';

export default class App extends Component {
  constructor(){
    super();
  }
  componentWillMount(){
  }


  render(){
    return <ActivityLog/>
  }
}
