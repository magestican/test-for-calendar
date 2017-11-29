import {GOT_ACTIVITY_LOG,GET_ACTIVITY_LOG,UPDATED_ACTIVITY_LOG_STATE} from '../actions/activityLog';
import objectAssign from 'object-assign';
import {clone} from './helper';
import {activityLogReducerInitialState} from './initialState';

export default function cvReducer(state = activityLogReducerInitialState, action) {
  let clonedLocations = '';
  let clonedState = '';
  switch (action.type) {
    case GET_ACTIVITY_LOG :
      return objectAssign({},state,{'gettingActivityLog' : true});
    case  GOT_ACTIVITY_LOG :
      return objectAssign({},state,{'gettingActivityLog' : false,activityLogList : action.data});
    case  UPDATED_ACTIVITY_LOG_STATE :
    clonedState = clone(state.activityLogState);
    clonedState = objectAssign(clonedState,action.data);
    debugger
      return objectAssign({},state,{'activityLogState' : clonedState });
    default:
      return state;
  }
}
