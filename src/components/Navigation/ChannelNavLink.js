import React, { Component } from "react";
import { Link } from "react-router-dom";

class ChannelNavLink extends Component {
  render() {
    const { channel } = this.props;
    return (
      <div className="row">
        <div
          className="col-12 my-1"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <Link to={`/channels/${channel.id}`}>
            <span># </span> {channel.name}
          </Link>
        </div>
      </div>
    );
  }
}

export default ChannelNavLink;
