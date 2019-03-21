import React, { Component } from "react";

import { connect } from "react-redux";

import * as actionCreators from "../store/actions/index";

class ChannelForm extends Component {
  state = {
    name: "",
    image_url: ""
  };

  textChangeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitChannel = event => {
    event.preventDefault();
    console.log("zerodebug => submitChannel: ", this.state);
    this.props.postChannel(this.state, this.props.history);
  };

  render() {
    const errors = this.props.errors;
    return (
      <div className="row my-4">
        <div className="col-12 text-center">
          <h4>Create a new channel</h4>

          <div className="card mx-auto p-0 mt-5 form-format">
            <div className="card-body my-3">
              <form onSubmit={this.submitChannel}>
                <div className="form-group">
                  <input
                    className={`form-control ${errors.name && "is-invalid"}`}
                    type="text"
                    placeholder="Channel Name"
                    name="name"
                    onChange={this.textChangeHandler}
                    maxLength="15"
                    minLength="3"
                  />
                  <i className="siconUser textMuted textBottom" />
                  <div className="invalid-feedback text-left">
                    {errors.name}
                  </div>
                </div>

                <div className="form-group my-4 ">
                  <input
                    className="form-control form-field-format"
                    type="text"
                    placeholder="Image URL"
                    name="image_url"
                    onChange={this.textChangeHandler}
                  />
                </div>
                <input
                  className="btn btn-light btn-block button-color"
                  type="submit"
                  value="Create"
                />
              </form>
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
    postChannel: (newCh, history) =>
      dispatch(actionCreators.postChannel(newCh, history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelForm);
