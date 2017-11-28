import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getActivityLog,updateActivityLogState} from '../actions/activityLog'
import { connect } from 'react-redux'
import {Dropdown } from 'semantic-ui-react'

@connect(mapStateToProps)
export default class ActivityLog extends Component {
  constructor(){
    super();
  }
  componentWillMount(){
    this.props.dispatch(getActivityLog());
  }

  getActivityItem(activityItem){
    return <div></div>
  }

  getActionDropdown = () =>{
    let {activityLogList} = this.props;
    let dynamicActions = [];
    activityLogList.map((logItem) => {dynamicActions.push(logItem.action)});

    let actionDropdownOptions = [{key: "allActions",value:"allActions",text:"All actions"}];
    let dynamicActionsTranslatedIntoDropdownData = dynamicActions.map((o)=> {
      return {key:o,text:o,value:o};
    });
    actionDropdownOptions = actionDropdownOptions.concat(dynamicActionsTranslatedIntoDropdownData);

    return <Dropdown  placeholder='All actions'  selection options={actionDropdownOptions} />
  }

  getStatusDropdown(){
    let statusDropdownOptions = [{ key: 'success', text: 'Success', value: 'success' },{ key: 'failed', text: 'Failed', value: 'failed' },{ key: 'allStatuses', text: 'All statuses', value: 'allStatuses' }];
    return  <Dropdown placeholder='All statuses' selection options={statusDropdownOptions} />
  }

  render(){
    let {activityLogList} = this.props;

    let {currentlySelectedDateFilter,currentSearch} = this.props.activityLogState;

    return <div className="activity-log">
    <div className="ui form">
      <div className="ui three fields">
        <div className="field">
          {this.getActionDropdown()}
        </div>
        <div className="field">
          {this.getStatusDropdown()}
        </div>
          {activityLogList.map((o)=>{
            return this.getActivityItem(o);
          })}
        </div>
      </div>
    </div>
  }
}


function mapStateToProps(state){
  return {
    gettingActivityLog: state.activityLogReducer.gettingActivityLog,
    activityLogList: state.activityLogReducer.activityLogList,
    activityLogState: state.activityLogReducer.activityLogState
  }
}
