import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getActivityLog} from '../actions/activityLog'
import { connect } from 'react-redux'
import Draggable from 'react-draggable';

@connect(mapStateToProps)
export default class ActivityLog extends Component {
  constructor(){
    super();
  }
  componentWillMount(){
  }

  render(){

    return <div>hello world</div>
  }
}


function mapStateToProps(state){
  return {
    activityLogData: state.activityLogReducer.activityLogData
  }
}
