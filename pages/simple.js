import dynamic from "next/dynamic";

const Full = dynamic(() => import("../src/pages/Simple.js"), {
  ssr: false
});

export default Full;
