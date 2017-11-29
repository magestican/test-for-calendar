import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getActivityLog, updateActivityLogState} from '../actions/activityLog'
import {connect} from 'react-redux'
import {Dropdown} from 'semantic-ui-react'
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

@connect(mapStateToProps)
export default class ActivityLog extends Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.props.dispatch(getActivityLog());
  }

  selectActivityItem = (activityItem) => {
    this.props.dispatch(updateActivityLogState({selectedActivityItem: activityItem}));
  }

  selectedDateChanged = (ev)=>{
    debugger
    this.props.dispatch(updateActivityLogState({currentlySelectedDateFilter: ev.unix()}));
  }

  updateSearchTerm = (ev) => {
    this.props.dispatch(updateActivityLogState({currentSearch: ev.target.value}));
  }

  getActivityItem = (activityItem) => {
    let {selectedActivityItem} = this.props.activityLogState;
    let getDate = () => {
      let parsedDate = moment.unix(activityItem.date);
      if (parsedDate)
        return parsedDate.format('MMMM DD, YYYY - HH:MM');
      else
        return 'Invalid Date';
      }
    let selected = activityItem.id == selectedActivityItem.id;

    return <div onClick={this.selectActivityItem.bind(this, activityItem)} className={selected ? 'ui row selected' : 'ui row'}>
      <div className="status column">{activityItem.status}</div>
      <div className="date column">{getDate()}</div>
      <div className="actions column">{activityItem.action}</div>
      <div className="who column">{activityItem.whoUser}</div>
    </div>
  }

  getActionDropdown = () => {
    let {activityLogList} = this.props;
    let dynamicActions = [];
    activityLogList.map((logItem) => {
      dynamicActions.push(logItem.action)
    });

    let actionDropdownOptions = [
      {
        key: "allActions",
        value: "allActions",
        text: "All actions"
      }
    ];
    let dynamicActionsTranslatedIntoDropdownData = dynamicActions.map((o) => {
      return {key: o, text: o, value: o};
    });
    actionDropdownOptions = actionDropdownOptions.concat(dynamicActionsTranslatedIntoDropdownData);

    return <Dropdown placeholder='All actions' selection options={actionDropdownOptions}/>
  }

  getStatusDropdown() {
    let statusDropdownOptions = [
      {
        key: 'success',
        text: 'Success',
        value: 'success'
      }, {
        key: 'failed',
        text: 'Failed',
        value: 'failed'
      }, {
        key: 'allStatuses',
        text: 'All statuses',
        value: 'allStatuses'
      }
    ];
    return <Dropdown placeholder='All statuses' selection options={statusDropdownOptions}/>
  }



  render() {
    let {activityLogList} = this.props;

    let {currentlySelectedDateFilter, currentSearch, selectedActivityItem} = this.props.activityLogState;

    let getActivityItemIfItMatchesSearchAndFilters = (item) => {
      //create metadata :
      let searchString = item.status + (moment.unix(item.date).format('MMMM DD, YYYY - HH:MM') || '') + item.whoUser + item.action;
      return searchString.toLowerCase().indexOf(currentSearch) > -1;
    }

    let getItemsFiltered = () => {

      let filteredResults = activityLogList.filter(o => getActivityItemIfItMatchesSearchAndFilters(o));

      return filteredResults.map((o) => {
        return this.getActivityItem(o);
      })
    }
    return (
      <div className="activity-log">
        <div className="left-section">
          <div className="ui grid">
            <div className="four column row">
              <div className="column">
                {this.getActionDropdown()}
              </div>
              <div className="column">
                {this.getStatusDropdown()}
              </div>
              <div className="column">
                <DatePicker selected={moment.unix(currentlySelectedDateFilter)} onChange={this.selectedDateChanged}/>
              </div>
              <div className="column">
                <div className="ui icon input">
                  <input defaultValue={currentSearch} onChange={this.updateSearchTerm} type="text" placeholder="Search..."/>
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="ui four column grid ">
            <div className="ui row header-section">
              <div className="ui column">status</div>
              <div className="ui column">date</div>
              <div className="ui column">actions</div>
              <div className="ui column">who</div>
            </div>
            {getItemsFiltered()}
          </div>
        </div>
        <div className="right-section">
          {selectedActivityItem.whoUser}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {gettingActivityLog: state.activityLogReducer.gettingActivityLog, activityLogList: state.activityLogReducer.activityLogList, activityLogState: state.activityLogReducer.activityLogState}
}
