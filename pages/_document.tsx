import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Styles, Scripts } from '../components/resources';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" type="image/png" href="/icons/clock-32.png" />
          <Styles />
        </Head>
        <body>
          <Main />
          <Scripts />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument