import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Styles, Scripts } from '../components/resources';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>

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