import React from "react";
import dynamic from "next/dynamic";

import "./../src/css/reset.css";
import "./../src/css/basic.css";

const Root = ({ children }) => <div id="app">{children}</div>;

const Main = dynamic(() => import("./exp/Main"), {
  ssr: false
});

export default () => {
  return (
    <Root>
      <Main />
    </Root>
  );
};
