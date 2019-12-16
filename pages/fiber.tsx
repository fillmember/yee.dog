import dynamic from "next/dynamic";
import Layout from "../src/UI/Layout";

const Fiber = dynamic(() => import("../src/fiber/test"), {
  ssr: false
});

export default () => (
  <Layout>
    <Fiber />
  </Layout>
);
