import React from "react";
import { Link } from "react-router-dom";

import * as actionCreators from "../../store/actions";
import chLoadingImg from "../../assets/images/chloading2.svg";

// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";

// Components
import ChannelNavLink from "./ChannelNavLink";
import SearchBar from "../SearchBar";

class SideNav extends React.Component {
  state = { collapsed: false };

  componentDidMount() {
    console.log("SideNav => componentDidMount ")
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("SideNav => componentDidUpdate ")

    console.log("SideNav => prevProps: ", prevProps)
    console.log("SideNav => thisProps: ", this.props)
    if(prevProps.user !== this.props.user ) this.props.getAllChannels()
  }
  render() {
    let user = this.props.user;
    let chs = this.props.filteredChannels;

    const channelLinks = chs.map(channel => (
      <ChannelNavLink key={channel.name} channel={channel} />
    ));

    if (user) {
      return (
        <div>
          <div className="row">
            <div className="col-1">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="col-11">{user ? `Hi ${user.username}` : ""}</div>
          </div>
          <div className="row my-2">
            <div className="col-1">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="col-11">
              <Link to={user ? "/createChannel" : "/login"}>Add a channel</Link>
            </div>
          </div>
          <hr />
          <SearchBar key="channels" filter={this.props.filterChannels}/>
          
          <div
            className="col-12 my-4 channels-board"
            style={{ maxHeight: 440 }}
          > 
            {
              user ? 
              (!this.props.loading ? channelLinks :
                <div className = "my-2">
                  {[...Array(15).keys()].map( _ => <img src={chLoadingImg}/>)}
                </div>)
              : <div />
            }

          </div>
        </div>

      );} 
      else {
        return <div />
      }
  } 
}

const mapStateToProps = state => {
  return {
    channels: state.channels.channelsObj,
    filteredChannels: state.channels.filteredChannelsObj,
    user: state.auth.user,
    loading: state.channels.chLoading,
  };
};


const mapDispatchToProps = dispatch => {
  return {
    filterChannels: (q) => dispatch(actionCreators.filterChannels(q)),
    setChannelLoading: () => dispatch(actionCreators.setChannelLoading()),
    getAllChannels: () => dispatch(actionCreators.getAllChannels()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
