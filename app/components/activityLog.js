import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getActivityLog, updateActivityLogState} from '../actions/activityLog'
import {connect} from 'react-redux'
import {Dropdown, Checkbox, Input,Button,Modal} from 'semantic-ui-react'
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
    this.props.dispatch(updateActivityLogState({
      currentlySelectedDateFilterStart: ev.unix() * 1000
    }));
  }
  selectedDateEndChanged = (ev) => {

    this.props.dispatch(updateActivityLogState({currentlySelectedDateFilterEnd: ev.unix() * 1000} ));
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

    return <div key={activityItem.id} onClick={this.selectActivityItem.bind(this, activityItem)} className={selected
      ? 'ui row selected'
      : 'ui row'}>
      <div className={activityItem.status == 'Failed'
        ? 'failed status column'
        : 'status column'}>{activityItem.status}</div>
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

  handleShowDateSelector =(show) =>{
    this.props.dispatch(updateActivityLogState({
      calendarControllerVisible : show
    }))
  }

  render() {
    let {activityLogList} = this.props;

    let {
      currentlySelectedDateFilterStart,
      currentSearch,
      selectedActivityItem,
      currentlySelectedStatusFilter,
      currentlySelectedActionFilter,
      currentlySelectedDateFilterEnd,
      calendarControllerVisible
    } = this.props.activityLogState;

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

      if (moment(moment(parseInt(item.date, 0)).toString()).isBetween(moment(currentlySelectedDateFilterStart).toString(), moment(currentlySelectedDateFilterEnd).toString()) || currentlySelectedDateFilterStart == currentlySelectedDateFilterEnd) {
        matchesDate = true
      }
      return matchesSearch && matchesStatus && matchesDate && matchesAction;
    }
    let capitalizeFirstLetter = (string) => {
      string = string || '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let getParsedMetadata = (actionMetadata) => {
      let metadataItems = [];
      for (var property in actionMetadata) {
        if (actionMetadata.hasOwnProperty(property)) {
          metadataItems.push(<div className="metadata-item">
            {property}: {actionMetadata[property] + ''}
          </div>)
        }
      }
      return metadataItems;
    }
    let getListOfUsers = () => {
      if (selectedActivityItem.otherWhoUsers && selectedActivityItem.otherWhoUsers.length > 0)
        return (
          <div>
            <div className="sub-title">Users involved in action</div>
            <div>
              {selectedActivityItem.otherWhoUsers.map((o, i) => {
                return o + (i == selectedActivityItem.otherWhoUsers.length - 1
                  ? ''
                  : ', ');
              })}
            </div>
          </div>
        )
      else
        return '';
      }

    let getItemsFiltered = () => {

      let filteredResults = activityLogList.filter(o => getActivityItemIfItMatchesSearchAndFilters(o));

      return filteredResults.map((o) => {
        return this.getActivityItem(o);
      })
    }

    let getCalendarController = () =>{

      return (<Modal onClose={this.handleShowDateSelector.bind(this,false)} size="tiny" open={calendarControllerVisible}>
          <Modal.Header>
            Select a date range
          </Modal.Header>
          <Modal.Content>
            <div className="field">
                <DatePicker selectsStart selected={moment(currentlySelectedDateFilterStart)} startDate={moment(currentlySelectedDateFilterStart)} endDate={moment(currentlySelectedDateFilterEnd)} onChange={this.selectedDateStartChanged}/>
            </div>
            <div className="field">
              <DatePicker  selected={moment(currentlySelectedDateFilterEnd)} selectsEnd startDate={moment(currentlySelectedDateFilterStart)} endDate={moment(currentlySelectedDateFilterEnd)} onChange={this.selectedDateEndChanged}/>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleShowDateSelector.bind(this,false)} negative>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>)
    }
    return (
      <div className="activity-log">
        {getCalendarController()}
        <div className="left-section">
          <div className="ui grid">
            <div className="top-container">
              <div className="field">
                {this.getActionDropdown()}
              </div>
              <div className="field">
                {this.getStatusDropdown()}
              </div>
              <div className="field">
                <Button basic onClick={this.handleShowDateSelector.bind(this,true)} content={moment(currentlySelectedDateFilterStart).format('MM/DD/YY') + '-' + moment(currentlySelectedDateFilterEnd).format('MM/DD/YY')  } icon='calendar' labelPosition='right' />
              </div>
              <div className="field">
                <div className="ui icon input">
                  <input defaultValue={currentSearch} onChange={this.updateSearchTerm} type="text" placeholder="Search..."/>
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="ui four column grid middle-container">
            <div className="ui row header-section">
              <div className="ui column title">status
                <i className="ui icon angle up"></i>
                <i className="ui icon angle down"></i>
              </div>
              <div className="ui column title">date
                <i className="ui icon angle up"></i>
                <i className="ui icon angle down"></i>
              </div>
              <div className="ui column title">actions
                <i className="ui icon angle up"></i>
                <i className="ui icon angle down"></i>
              </div>
              <div className="ui column title">who
                <i className="ui icon angle up"></i>
                <i className="ui icon angle down"></i>
              </div>
              <div className="divider"></div>
            </div>
            {getItemsFiltered()}
          </div>
        </div>
        <div className="right-section">

          <div className="top-container">
            <div className="checkbox-container">
              Auto-retry
              <Checkbox checked toggle/>
            </div>
          </div>
          <div className="bottom-container">
            <div className="title">details</div>
            <div className="divider"></div>
            <div className="sub-title">Date</div>
            <div>
              {(moment.unix(selectedActivityItem.date).format('MMMM DD, YYYY - HH:MM') || '')}
            </div>
            <div className="sub-title">Action</div>
            <div>{capitalizeFirstLetter(selectedActivityItem.action)}</div>
            <div className="sub-title">User who initiated action</div>
            <div>{selectedActivityItem.whoUser}</div>
            {getListOfUsers()}

            <div className="metadata-field">
              <div className="sub-title">Input fields:</div>
              {getParsedMetadata(selectedActivityItem.actionInputMetadata)}
            </div>
            <div className="metadata-field">
              <div className="sub-title">Output message:</div>
              {getParsedMetadata(selectedActivityItem.actionOutputMetadata)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {gettingActivityLog: state.activityLogReducer.gettingActivityLog, activityLogList: state.activityLogReducer.activityLogList, activityLogState: state.activityLogReducer.activityLogState}
}
