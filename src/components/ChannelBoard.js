import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../store/actions";

import pic from "../assets/images/logo.png";

// Components
import SearchBar from "./SearchBar";

import Sound from "react-sound";
import soundFile from "../assets/openended.mp3";

// Import spinners library
import { HashLoader } from "react-spinners";

// animations
import { Animated } from "react-animated-css";

// Utility functions
Array.prototype.getRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

const override = {
	marginTop: "16%",
	marginLeft: "45%"
};

const colors = ["#E9A829", "#DC1B50", "#2FBEEE", "#29AD72"];

const formatAMPM = date => {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";

	hours = hours % 12 || 12; // the hour '0' should be '12'

	minutes = minutes < 10 ? "0" + minutes : minutes;

	return hours + ":" + minutes + " " + ampm;
};

const formatTimeS = ts => {
	let dateObj = new Date(ts);
	let date = dateObj.toDateString(); // Where do we use it ?
	let time = formatAMPM(dateObj);

	return time;
};

class ChannelBoard extends Component {

	state = {
		message: "",
		played: false,
	};

	async componentDidMount() {
		let currentChID = this.props.match.params.channelID;
		console.log("componentDidMount => ChannelBoard");

		await this.props.getChannelMsgs(currentChID);

		// when creating a new channel 
		// this condiotion will prevent undfined behavior 
		if (this.props.chObjMsgs.length > 0) {
			this.checkForMsgsInterval = setInterval(() => {
			let msgs = this.props.chObjMsgs;
			let lastMsg = msgs[msgs.length - 1];
			this.props.getChannelMsgs(currentChID, lastMsg.timestamp);
			},
			3000);	
		}
		

		this.props.getChannelInfo(currentChID);

		if (!this.props.loading) this.scroll("auto")
	}

	async componentDidUpdate(prevProps, prevState) {
		let currentChID = this.props.match.params.channelID;

		console.log("componentDidUpdate => ChannelBoard");

		// Sound related
		if (prevProps.chObjMsgs && this.props.chObjMsgs) {
			if (prevProps.chObjMsgs.length !== this.props.chObjMsgs.length) {
				this.setState({ played: true });
				if (prevProps.chObjMsgs.length > 0) this.scroll("smooth")
			}
		}

		// when tapping to different channels
		if (prevProps.match.params.channelID !== currentChID) {
			console.log("prevProps.match.params.channelID !== currentChID")
			this.props.setMsgLoading();
			console.log("this.checkForMsgsInterval: ", this.checkForMsgsInterval)
			clearInterval(this.checkForMsgsInterval);
			console.log("this.checkForMsgsInterval: ", this.checkForMsgsInterval)
			await this.props.getChannelMsgs(currentChID);

			this.checkForMsgsInterval = setInterval(
				() => {
					let msgs = this.props.chObjMsgs;
					let lastMsg = msgs[msgs.length - 1];
					this.props.getChannelMsgs(
						currentChID,
						lastMsg.timestamp
					)
				},
				3000
			);

			this.props.getChannelInfo(currentChID);
			this.props.restQuery();
			
			if (!this.props.loading) this.scroll("auto")
		}	
	}

	componentWillUnmount() {
		console.log("componentWillUnmount")
		clearInterval(this.checkForMsgsInterval);
	}

	textChangeHandler = event => {
		this.setState({ message: event.target.value });
	};

	scroll = (behavior) => {
		let elm = document.getElementById("prescroll")
		elm.scrollIntoView({behavior: behavior})
	}
	submitMsg = event => {
		let currentChID = this.props.match.params.channelID;
		event.preventDefault();
		console.log("zerodebug => submitMsg: ", this.state.message);
		console.log("zerodebug => this.currentChID: ", this.currentChID);
		let msgObj = { message: this.state.message };
		this.props.postMsg(msgObj, currentChID);
		this.setState({ message: "" });
	};

	sound = () => {
		return (
			<Sound
				url={soundFile}
				playStatus={Sound.status.PLAYING}
				autoLoad={true}
				autoPlay={true}
				onError={(errorCode, description) => {
					console.log("sound error: ", description);
				}}
				onFinishedPlaying={this.togglePlay}
			/>
		);
	};

	togglePlay = () => this.setState({ played: false });

	render() {
		let msgs = (
			<div className="text-center mt-4">
				<HashLoader
					css={override}
					sizeUnit={"px"}
					size={150}
					color={colors.getRandom()}
				/>
			</div>
		);

		let chObjMsgs = this.props.filterChObjMsgs;

		if (!this.props.loading) {
			let username = this.props.user.username;

			console.log("zerodebug => username: ", username);

			{
				/* Map to chat's messages */
			}
			msgs = chObjMsgs.map(msg => {
				// `isUser` might not be the best name for a var here... 
				let isUser = username === msg.username;
				
				return (
					<Animated 
						animationIn = {isUser ? "slideInRight" : "slideInLeft"}
						animationOut = "fadeOut" 
						isVisible = {true}
					>

						<div>
							{/* Display user name & his img in the chat */}
							<span
								className={
									isUser
										? "chat-username float-right my-1"
										: "chat-username text-left float-left my-1"
								}
								style={{ clear: "both" }}
							>
								{isUser ? (
									""
								) : (
									<span class="">
										<img
											src={pic}
											class="rounded mx-2"
											alt={msg.username}
											style={
												isUser
													? {
															width: "20px",
															textAlign: "right",
															float: "right"
													  }
													: {
															width: "20px",
															textAlign: "left",
															float: "left"
													  }
											}
										/>

										<span>
											{msg.username.replace(/^\w/, c =>
												c.toUpperCase()
											)}
										</span>
									</span>
								)}
							</span>
							{/* Display user msg & the msg's time in the chat */}
							<div
								class={
									isUser
										? "col-6 alert alert-success text-right float-right"
										: "col-6 alert alert-warning text-left"
								}
								style={
									isUser
										? {
												clear: "both",
												borderRadius: "25px 4px 25px 25px"
										  }
										: {
												clear: "both",
												borderRadius: "4px 25px 25px 25px"
										  }
								}
								role="alert"
							>
								<p
									style={{
										wordBreak: "break-word"
									}}
								>
									{msg.message}
								</p>
								<small className="chat-time">
									{formatTimeS(msg.timestamp)}
								</small>
							</div>
						</div>

					</Animated>
				); 
			});
		}

		return (
			<div
				className="row my-3"
				style={{ height: "565px", overflow: "visible" }}
			>
				{/* Display channel name && channel image in the chat */}
				<div
					className="col-5"
					style={{
            borderBottom: "1px solid #e7e7e7",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
				>
					<span>
						{this.props.chInfo.image_url ? (
							<img
								src={this.props.chInfo.image_url}
								class="rounded mx-2"
								alt={this.props.chInfo.name}
								style={{
									width: "30px",
									height: "30px",
									objectFit: "cover",
									textAlign: "left",
									float: "left"
								}}
							/>
						) : (
							<img
								src={pic}
								class="rounded mx-2"
								alt={this.props.chInfo.name}
								style={{
									width: "20px",
									height: "20px",
									textAlign: "left",
									float: "left"
								}}
							/>
						)}
						<span
							style={{
								wordBreak: "break-word",
								textOverflow: "ellipsis"
							}}
						>
							{this.props.chInfo.name}
						</span>
					</span>
				</div>
				{/* Display search bar in the chat */}
				<div className="col-7 ">
					<SearchBar
						key={this.props.chInfo.id}
						filter={this.props.filterMsgs}
					/>
				</div>
				<div className="col-12 ">
					<div
						className="container my-4 content-board"
						style={{ height: "445px", maxHeight: "445px" }}
					>
						{msgs}
						<div id="prescroll"> </div>
					</div>
				</div>
				<div className="col-12">
					{/* User message input */}
					<form onSubmit={this.submitMsg}>
						<div className="input-group mb-5">
							<input
								type="text"
								className="form-control"
								placeholder="Your message . ."
								name="message"
								value={this.state.message}
								onChange={this.textChangeHandler}
							/>

							<div className="input-group-append">
								<button
									className="btn btn-outline-info"
									type="button"
									id="button-addon2"
									onClick={this.submitMsg}
								>
									Send
								</button>
							</div>

							{this.state.played && this.sound()}
						</div>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user,
		chObjMsgs: state.channels.chObjMsgs,
		filterChObjMsgs: state.channels.filterChObjMsgs,
		chInfo: state.channels.chInfo,
		loading: state.channels.msgLoading
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getChannelMsgs: (chID, time) =>
			dispatch(actionCreators.getChannelMsgs(chID, time)),
		postMsg: (msg, chID) => dispatch(actionCreators.postMsg(msg, chID)),
		getChannelInfo: chID => dispatch(actionCreators.getChannelInfo(chID)),
		filterMsgs: q => dispatch(actionCreators.filterMsgs(q)),
		restQuery: () => dispatch(actionCreators.restQuery()),
		setMsgLoading: () => dispatch(actionCreators.setMsgLoading())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChannelBoard);
