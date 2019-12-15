import dynamic from "next/dynamic";
import Layout from "../src/UI/Layout";

const Simple = dynamic(() => import("../src/pages/Simple"), {
  ssr: false
});

export default () => (
  <Layout>
    <Simple />
  </Layout>
);
