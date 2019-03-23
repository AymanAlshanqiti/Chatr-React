import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../store/actions";

// Components
import SearchBar from "./SearchBar";
import MessageBox from "./MessageBox";
import Loading from "./Loading";

import Sound from "react-sound";
import soundFile from "../assets/openended.mp3";
import pic from "../assets/images/logo.png";

// Import spinners library
import { HashLoader } from "react-spinners";

// animations
import { Animated } from "react-animated-css";

class ChannelBoard extends Component {
  state = {
    message: "",
    played: false
  };

  async componentDidMount() {
    let currentChID = this.props.match.params.channelID;

    await this.props.getChannelMsgs(currentChID);

    // when creating a new channel
    // this condiotion will prevent undfined behavior
    if (this.props.chObjMsgs.length > 0) {
      this.checkForMsgsInterval = setInterval(() => {
        let msgs = this.props.chObjMsgs;
        let lastMsg = msgs[msgs.length - 1];
        this.props.getChannelMsgs(currentChID, lastMsg.timestamp);
      }, 3000);
    }

    this.props.getChannelInfo(currentChID);

    if (!this.props.loading) this.scroll("auto");
  }

  async componentDidUpdate(prevProps, prevState) {
    let currentChID = this.props.match.params.channelID;

    console.log("componentDidUpdate");

    // when tapping to different channels
    if (prevProps.match.params.channelID !== currentChID) {
      this.props.setMsgLoading();
      console.log(
        "clearInterval(this.checkForMsgsInterval): ",
        this.checkForMsgsInterval
      );
      clearInterval(this.checkForMsgsInterval);

      await this.props.getChannelMsgs(currentChID);

      this.checkForMsgsInterval = setInterval(() => {
        let msgs = this.props.chObjMsgs;
        let lastMsg = msgs[msgs.length - 1];
        this.props.getChannelMsgs(currentChID, lastMsg.timestamp);
      }, 3000);

      console.log(
        "clearInterval(this.checkForMsgsInterval): ",
        this.checkForMsgsInterval
      );
      this.props.getChannelInfo(currentChID);
      this.props.restQuery();

      if (!this.props.loading) this.scroll("auto");
    }

    // Sound related
    if (prevProps.chObjMsgs && this.props.chObjMsgs) {
      if (prevProps.chObjMsgs.length !== this.props.chObjMsgs.length) {
        this.setState({ played: true });
        if (prevProps.chObjMsgs.length > 0) this.scroll("smooth");
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkForMsgsInterval);
  }

  textChangeHandler = event => {
    this.setState({ message: event.target.value });
  };

  scroll = behavior => {
    let elm = document.getElementById("prescroll");
    elm.scrollIntoView({ behavior: behavior });
  };
  submitMsg = event => {
    let currentChID = this.props.match.params.channelID;
    event.preventDefault();

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
        onError={(errorCode, description) => {}}
        onFinishedPlaying={this.togglePlay}
      />
    );
  };

  togglePlay = () => this.setState({ played: false });

  render() {
    let chObjMsgs = this.props.filterChObjMsgs;

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
            {/* === Messages will be fetch here === */}

            {!this.props.loading ? (
              chObjMsgs.map(msg => <MessageBox msg={msg} />)
            ) : (
              <Loading />
            )}

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
                placeholder={`Message Invade ${this.props.chInfo.name ||
                  ""} . .`}
                name="message"
                value={this.state.message}
                onChange={this.textChangeHandler}
              />

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
