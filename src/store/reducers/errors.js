import * as actionTypes from "../actions/actionTypes";

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ERRORS:
      return action.payload;

    case actionTypes.RESET_ERRORS:
      return action.payload;

    default:
      return state;
  }
};

export default reducer;
