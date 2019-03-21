import * as actionTypes from "./actionTypes";

export const setErrors = errors => ({
  type: actionTypes.SET_ERRORS,
  payload: errors
});

export const reSetErrors = () => {
  return {
    type: actionTypes.RESET_ERRORS,
    payload: {}
  };
};
