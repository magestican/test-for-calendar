export const GET_ACTIVITY_LOG = "GET_ACTIVITY_LOG";
export const GOT_ACTIVITY_LOG = "GOT_ACTIVITY_LOG";

export let addClimateLocation = ()=>{
    return (dispatch) => {
      dispatch({type:GET_ACTIVITY_LOG})
      fetch(`${window.APP.apiPath}/activityLog.json`,{method : 'POST'}).then((res)=>{
        return res.json().then(data => {
          return dispatch({ type: GOT_ACTIVITY_LOG, data : data });
        })
      })
    }
}
