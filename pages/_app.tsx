import Head from "next/head";
import "../src/css/style.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>Hello!</Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
