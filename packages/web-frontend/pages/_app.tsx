import "@/src/system/globals.css";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const AnyComponent  = Component as unknown as any;
  return <AnyComponent {...pageProps} />
}
