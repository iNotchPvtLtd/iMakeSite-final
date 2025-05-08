// pages/index.tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false, // Set to true if this redirect is permanent
    },
  };
};

export default function Home() {
  return (
    <div className="loading-wrapper">
      <div className="loading-content">
        <h1>iMakeSite</h1>
        <p>Loading your workspace...</p>
      </div>

      <style jsx>{`
        .loading-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
        }

        .loading-content {
          text-align: center;
          padding: 2rem;
        }

        h1 {
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        p {
          color: #718096;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
