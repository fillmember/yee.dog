import dynamic from "next/dynamic";

const Fiber = dynamic(() => import("../src/fiber/page-test"), {
  ssr: false,
});

export default () => <Fiber />;
