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

  selectedDateStartChanged = (ev) => {
    this.props.dispatch(updateActivityLogState({currentlySelectedDateFilterStart: ev.unix() * 1000}));
  }
  selectedDateEndChanged = (ev) => {
    this.props.dispatch(updateActivityLogState({currentlySelectedDateFilterEnd: ev.unix()} * 1000));
  }



  updateSearchTerm = (ev) => {
    this.props.dispatch(updateActivityLogState({currentSearch: ev.target.value}));
  }

  getActivityItem = (activityItem) => {
    let {selectedActivityItem} = this.props.activityLogState;
    let getDate = () => {
      let parsedDate = moment(activityItem.date);
      if (parsedDate)
        return parsedDate.format('MMMM DD, YYYY - HH:MM');
      else
        return 'Invalid Date';
      }
    let selected = activityItem.id == selectedActivityItem.id;

    return <div onClick={this.selectActivityItem.bind(this, activityItem)} className={selected
      ? 'ui row selected'
      : 'ui row'}>
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

    return <Dropdown onChange={this.selectedActionFilter} placeholder='All actions' selection options={actionDropdownOptions}/>
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
    return <Dropdown onChange={this.selectedStatusFilter} placeholder='All statuses' selection options={statusDropdownOptions}/>
  }

  selectedStatusFilter = (ev, dataObject) => {
    this.props.dispatch(updateActivityLogState({currentlySelectedStatusFilter: dataObject.value}));
  }

  selectedActionFilter = (ev, dataObject) => {
    this.props.dispatch(updateActivityLogState({currentlySelectedActionFilter: dataObject.value}));
  }

  render() {
    let {activityLogList} = this.props;

    let {currentlySelectedDateFilterStart, currentSearch, selectedActivityItem, currentlySelectedStatusFilter, currentlySelectedActionFilter,currentlySelectedDateFilterEnd} = this.props.activityLogState;

    let getActivityItemIfItMatchesSearchAndFilters = (item) => {
      //create metadata :
      let searchString = item.status + (moment.unix(item.date).format('MMMM DD, YYYY - HH:MM') || '') + item.whoUser + item.action;
      let matchesSearch = false;
      let matchesStatus = false;
      let matchesDate = false;
      let matchesAction = false;
      if (searchString) {
        matchesSearch = searchString.toLowerCase().indexOf(currentSearch) > -1;
      }

      if (currentlySelectedStatusFilter) {
        if (item.status.toLowerCase() == currentlySelectedStatusFilter || currentlySelectedStatusFilter == 'allStatuses') {
          matchesStatus = true
        }
      }

      if (currentlySelectedActionFilter) {
        if (item.action == currentlySelectedActionFilter || currentlySelectedActionFilter == 'allActions') {
          matchesAction = true
        }
      }

      if (moment(moment(parseInt(item.date,0)).toString()).isBetween(moment(currentlySelectedDateFilterStart).toString(),moment(currentlySelectedDateFilterEnd).toString()) || currentlySelectedDateFilterStart == currentlySelectedDateFilterEnd) {
        matchesDate = true
      }
      return matchesSearch && matchesStatus && matchesDate && matchesAction;
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
                <DatePicker selectsStart selected={moment(currentlySelectedDateFilterStart)} startDate={moment(currentlySelectedDateFilterStart)} endDate={moment(currentlySelectedDateFilterEnd)} onChange={this.selectedDateStartChanged}/>
                <DatePicker className="invisible" selected={moment(currentlySelectedDateFilterEnd)} selectsEnd startDate={moment(currentlySelectedDateFilterStart)} endDate={moment(currentlySelectedDateFilterEnd)} onChange={this.selectedDateEndChanged}/>
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
