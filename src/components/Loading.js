import React from "react";
// Import spinners library
import { HashLoader } from "react-spinners";

// Utility functions
Array.prototype.getRandom = function() {
  return this[Math.floor(Math.random() * this.length)];
};

const override = {
  marginTop: "16%",
  marginLeft: "45%"
};

const colors = ["#E9A829", "#DC1B50", "#2FBEEE", "#29AD72"];

const Loading = props => {
  return (
    <div className="text-center mt-4">
      <HashLoader
        css={override}
        sizeUnit={"px"}
        size={150}
        color={colors.getRandom()}
      />
    </div>
  );
};

export default Loading;
