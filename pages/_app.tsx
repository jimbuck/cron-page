// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'

import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useServiceWorker } from '../hooks/service-worker';

function MyApp({ Component, pageProps }: AppProps) {

  useServiceWorker('/sw.js');

  return <div className="container">
    <Row>
      <Col>
        <h1>Record Reminder</h1>
      </Col>
    </Row>
    <Component {...pageProps} />
  </div>
}



// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp