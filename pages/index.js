import dynamic from "next/dynamic";

const Full = dynamic(() => import("../src/pages/Full.js"), {
  ssr: false
});

export default Full;
