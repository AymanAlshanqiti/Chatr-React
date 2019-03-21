import React, { Component } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/images/logo.png";

import { connect } from "react-redux";

import * as actionCreators from "../store/actions/index";

class RegistationForm extends Component {
  state = {
    username: "",
    password: ""
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = e => {
    const urlType = this.props.match.url.substring(1);
    e.preventDefault();
    if (urlType === "login") {
      return this.props.login(this.state, this.props.history);
    }
    this.props.signup(this.state, this.props.history);
  };

  render() {
    const errors = this.props.errors;

    const urlType = this.props.match.url.substring(1);

    return (
      <div className="row ">
        <div className="col-12 text-center my-4">
          <img src={logo} style={{ width: 100 }} />
          <h1>Slack Me</h1>
        </div>
        <div className="col-12">
          <div className="card mx-auto p-0 mt-3 form-format my-4">
            <div className="card-body mb-3">
              <form onSubmit={this.submitHandler}>
                <div className="form-group">
                  <input
                    className={`form-control ${errors.username &&
                      "is-invalid"} ${errors.non_field_errors && "is-invalid"}`}
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={this.changeHandler}
                  />
                  <i className="siconUser textMuted textBottom" />
                  <div className="invalid-feedback text-left">
                    {errors.username}
                  </div>
                  <div className="invalid-feedback text-left">
                    {errors.non_field_errors}
                  </div>
                </div>
                <div className="form-group my-4 ">
                  <input
                    className={`form-control form-field-format ${errors.password &&
                      "is-invalid"} ${errors.non_field_errors && "is-invalid"}`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.changeHandler}
                  />
                  <i className="siconUser textMuted textBottom" />
                  <div className="invalid-feedback text-left">
                    {errors.password}
                  </div>
                </div>
                <input
                  className="btn btn-light btn-block button-color"
                  type="submit"
                  value={urlType.replace(/^\w/, c => c.toUpperCase())}
                />
              </form>
            </div>

            <div className="card-footer text-center">
              <Link
                to={urlType === "login" ? "/signup" : "/login"}
                className="btn btn-small btn-link"
              >
                {urlType === "login"
                  ? "Register an account"
                  : "Have an account? Log in"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (userData, history) =>
      dispatch(actionCreators.login(userData, history)),
    signup: (userData, history) =>
      dispatch(actionCreators.signup(userData, history)),

    reSetErrors: () => dispatch(actionCreators.reSetErrors)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistationForm);
