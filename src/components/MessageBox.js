import React, { Component } from "react";
import { connect } from "react-redux";

import { Animated } from "react-animated-css";
import pic from "../assets/images/logo.png";

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

class MessageBox extends Component {
  render() {
    let username = this.props.user.username;
    let msg = this.props.msg;
    // send the Msg object as a prop
    let isUser = username === msg.username;

    return (
      <div>
        <Animated
          animationIn={isUser ? "slideInRight" : "slideInLeft"}
          animationOut="fadeOut"
          isVisible={true}
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
                    {msg.username.replace(/^\w/, c => c.toUpperCase())}
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
              <small className="chat-time">{formatTimeS(msg.timestamp)}</small>
            </div>
          </div>
        </Animated>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(MessageBox);
