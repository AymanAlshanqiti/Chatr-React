import axios from "axios";

import * as actionTypes from "./actionTypes";

import { setErrors } from "./errors";


const instance = axios.create({
	baseURL: "https://api-chatr.herokuapp.com/"
});


export const getAllChannels = () => {
	return async dispatch => {
		try {
			let response = await instance.get("/channels/");
			let channels = response.data;

			console.log("zerodebug => channels action => getAllChannels => res.data: ". channels)
			dispatch({
				type: actionTypes.GET_ALL_CHANNELS,
				payload: channels,
			})

		} catch (error) {
			dispatch(setErrors(error))
			console.error(error.response.data);
		}
	}
};


export const getChannel = (chID) => {
	console.log(chID)
	return async dispatch => {
		try {
			// console.log("zerodebug => getChannel => chObj: ", chID)
			// let chID = chObj.id
			let response = await instance.get(`/channels/${chID}/`);
			let channel = response.data;

			// console.log("zerodebug => channel action => getChannel => res.data: ". channel)
			dispatch({
				type: actionTypes.GET_CHANNEL,
				payload: channel,
			})

		} catch (error) {
			dispatch(setErrors(error))
			console.error(error.response.data);
		}
	}
};


export const postChannel = (newCh) => {
	return async dispatch => {
		try {
			console.log("New channel obj: ", newCh)
			let response = await instance.post("/channels/create/", newCh);
			
			let newChObj = response.data;

			console.log("zerodebug => channels action => postChannel => res.data: ", newChObj)
			dispatch({
				type: actionTypes.POST_CHANNEL,
				payload: newChObj,
			})

		} catch (error) {
			dispatch(setErrors(error))
			console.error(error.response.data);
		}
	}
};


export const postMsg = (msg, chID) => {
	console.log(msg)
	return async dispatch => {
		try {
			console.log("New msg sent: ", msg)
			console.log("chID: ", chID)

			let response = await instance.post(`/channels/${chID}/send/`, msg);
			
			let newMsg = response.data;

			dispatch({
				type: actionTypes.POST_MSG,
				payload: newMsg,
			})

			dispatch(getChannel(chID))

		} catch (error) {
			dispatch(setErrors(error))
			console.error(error.response.data);
		}
	}
};