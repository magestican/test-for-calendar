import moment from 'moment';
export  let activityLogReducerInitialState = {
  activityLogList : [],
  activityLogState : {
    selectedActivityItem:{},
    currentSearch: '',
    currentlySelectedDateFilter : moment().unix(), //data can only be stored in localstorage in unix format, in order to be retrieved from cache
    currentlySelectedStatusFilter : '',
    currentlySelectedActionFilter : ''
  },
  gettingActivityLog : false
}

export let initialState = { activityLogReducer : activityLogReducerInitialState }
