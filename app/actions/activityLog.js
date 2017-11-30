export const GET_ACTIVITY_LOG = "GET_ACTIVITY_LOG";
export const GOT_ACTIVITY_LOG = "GOT_ACTIVITY_LOG";
export const UPDATED_ACTIVITY_LOG_STATE = "UPDATED_ACTIVITY_LOG_STATE";

export let getActivityLog = ()=>{
    return (dispatch) => {
      dispatch({type:GET_ACTIVITY_LOG})
      fetch(`${window.ActivityAPP.apiEndpoint + window.ActivityAPP.apis.activityLog}`,{method : 'GET'}).then((res)=>{
        return res.json().then(data => {
          console.log(data);
          return dispatch({ type: GOT_ACTIVITY_LOG, data : data });
        })
      })
    }
}

export let updateActivityLogState = (newState)=>{
    return { type: UPDATED_ACTIVITY_LOG_STATE, data : newState };
}
