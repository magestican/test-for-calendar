import moment from 'moment';
export  let activityLogReducerInitialState = {
  activityLogList : [],
  activityLogState : {
    selectedActivityItem:{},
    currentSearch: '',
    currentlySelectedDateFilterEnd : moment().unix() * 1000,
    currentlySelectedDateFilterStart : moment().unix() * 1000, //data can only be stored in localstorage in unix format, in order to be retrieved from cache
    currentlySelectedStatusFilter : 'allStatuses',
    currentlySelectedActionFilter : 'allActions'
  },
  gettingActivityLog : false
}

export let initialState = { activityLogReducer : activityLogReducerInitialState }
