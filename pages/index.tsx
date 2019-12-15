import dynamic from "next/dynamic";
import Layout from "../src/UI/Layout";

const Full = dynamic(() => import("../src/pages/Full"), {
  ssr: false
});

export default () => (
  <Layout>
    <Full />
  </Layout>
);
