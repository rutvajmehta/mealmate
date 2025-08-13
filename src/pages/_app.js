// src/pages/_app.js
import "../styles.css";            // <- global Tailwind CSS here

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
