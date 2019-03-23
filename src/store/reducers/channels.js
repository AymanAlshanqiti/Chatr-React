import * as actionTypes from "../actions/actionTypes";

const initialState = {
  channelsObj: [],
  filteredChannelsObj: [],
  query: "",

  chObjMsgs: [],
  filterChObjMsgs: [],
  chInfo: {},

  msgLoading: true,
  chLoading: true,

  msg: "" // not used yet
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_CHANNELS:
      return {
        ...state,
        channelsObj: action.payload,
        filteredChannelsObj: action.payload,
        chLoading: false
      };

    case actionTypes.POST_CHANNEL:
      return {
        ...state,
        channelsObj: [...state.channelsObj, action.payload]
      };

    case actionTypes.GET_CHANNEL_MSGS:
      let isTime = action.ts
      
      // at the first run fetch all the msgs.
      let msgs = action.payload

      // when a timestamp(ts) passed, fetch only msgs
      // after the ts and append it to the prev msgs
      if (isTime) {
        msgs = state.chObjMsgs.concat(action.payload)
      }
      return {
        ...state,
        chObjMsgs: msgs,
        filterChObjMsgs: msgs.filter(msg => {
          return `${msg.message}`.toLowerCase().includes(state.query);
        }),
        msgLoading: false
      };

    case actionTypes.POST_MSG:
      return {
        ...state,
        msg: action.payload
      };

    case actionTypes.GET_CHANNEL_INFO:
      let chInfo = state.channelsObj.find(ch => ch.id === +action.payload);
      
      return {
        ...state,
        chInfo: chInfo
      };

    case actionTypes.FILTER_CHANNELS:
      let filteredCh = state.channelsObj.filter(ch => {
        
        return `${ch.name}`.toLowerCase().includes(action.payload);
      });

      
      return {
        ...state,
        filteredChannelsObj: filteredCh
      };

    case actionTypes.FILTER_MSGS:
      let filterChObjs = state.chObjMsgs.filter(msg => {
        return `${msg.message}`.toLowerCase().includes(action.payload);
      });

      return {
        ...state,
        query: action.payload,
        filterChObjMsgs: filterChObjs
      };

    case actionTypes.REST_QUERY:
      return {
        ...state,
        query: ""
      };

    case actionTypes.SET_MSG_LOADING:
      return {
        ...state,
        msgLoading: true
      };

    case actionTypes.SET_MSG_LOADING:
      return {
        ...state,
        chLoading: true
      };

    default:
      return state;
  }
};

export default reducer;
