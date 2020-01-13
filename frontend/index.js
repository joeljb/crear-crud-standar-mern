import React from "react";
import ReactDom from "react-dom";
import IndexView from "./components/index";
const Index = () => {
  return <IndexView />;
};

ReactDom.render(<Index />, document.getElementById("app"));