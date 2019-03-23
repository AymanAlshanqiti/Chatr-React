import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

// Scripts
import main from "./assets/js/main";

// Components
import NavBar from "./components/Navigation/NavBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Welcome from "./components/Welcome";
import RegistrationForm from "./components/RegistrationForm";
import ChannelForm from "./components/ChannelForm";
import ChannelBoard from "./components/ChannelBoard";

import { connect } from "react-redux";

import * as actionCreators from "./store/actions/index";

class App extends Component {
  componentDidMount() {
    main();
    this.props.checkForExpiredToken();
    
  }
  componentDidUpdate(prevProps, prevState) {
    
  }
  render() {
    let user = this.props.user
    return (
      <div className="container">
        <div className="row my-4">
          <NavBar />
          <div
            className="col-8 content "
            style={{ height: "600px", maxHeight: "600px" }}
          >
            <Switch>
              <Route path="/welcome" component={Welcome} />

              {!user && <Route path="/(login|signup)" component={RegistrationForm} />}

              <PrivateRoute
                path="/channels/:channelID"
                component={ChannelBoard}
              />
              <PrivateRoute path="/createChannel" component={ChannelForm} />
              <Redirect to="/login" />
            </Switch>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};


const mapDispatchToProps = dispatch => {
  return {
    checkForExpiredToken: () => dispatch(actionCreators.checkForExpiredToken()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
