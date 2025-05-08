import "grapesjs/dist/css/grapes.min.css";
import "../styles/global.css";
import Head from 'next/head';
import { SessionProvider } from '../src/context/SessionContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        /> */}
      </Head>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}


// export default function App({ Component, pageProps }) {
//   return (
//     <>
//       <Head>
//         <link 
//           rel="stylesheet" 
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
//         />
//       </Head>
//       <Component {...pageProps} />
//     </>
//   );
// }




// import "grapesjs/dist/css/grapes.min.css";
// import "../styles/editor..css";
// import "../styles/global.css";
// // import { SessionProvider } from "next-auth/react";
// // import { useEffect } from 'react';
// // import dbConnect from './../src/utils/dbConnect';
// import Head from 'next/head';

// export default function App({ Component, pageProps: { session, ...pageProps } }) {
//   // useEffect(() => {
//   //   const connectDB = async () => {
//   //     try {
//   //       await dbConnect();
//   //       console.log('Connected to MongoDB');
//   //     } catch (error) {
//   //       console.error('MongoDB connection error:', error);
//   //     }
//   //   };
//   //   connectDB();
//   // }, []);

//   return (
//     <SessionProvider session={session}>
//       {/* <Head>
//         <link 
//           rel="stylesheet" 
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
//         />
//       </Head> */}
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// }