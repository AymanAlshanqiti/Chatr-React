import React, { Component } from "react";
import { Link } from "react-router-dom";

// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";

class Welcome extends Component {
  render() {
    
    return (
      <header className="masthead my-4 d-flex">
        <div className="container  text-center my-auto z-1">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          {!this.props.user ? (
            <div>
              <h3 className="mb-5">
                <h1>Login To Access Our Awesome Channels</h1>
              </h3>
              <Link to="/login" className="btn btn-light btn-lg button-color">
                Login
              </Link>
            </div>
          ) : (
            <h1>
              Welcome To Our Awesome Channels{" "}
              <span>
                {" "}
                <FontAwesomeIcon className="heart" icon={faHeart} />
              </span>
            </h1>
          )}
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Welcome);
