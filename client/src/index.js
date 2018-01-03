import React from "react";
import ReactDOM from "react-dom";
import Routing from "./Routing";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Routing />, document.getElementById("root"));
registerServiceWorker();
