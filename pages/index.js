import React from "react";
import dynamic from "next/dynamic";

import "./../src/css/reset.css";
import "./../src/css/basic.css";

const App = dynamic(() => import("../src/App"), {
  ssr: false
});

export default () => <App />;
