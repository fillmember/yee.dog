import dynamic from "next/dynamic";
import Layout from "../src/UI/Layout";

const App = dynamic(() => import("../src/App"), {
  ssr: false
});

export default () => (
  <Layout>
    <App />
  </Layout>
);
