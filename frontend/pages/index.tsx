import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Navbar, Hero, Footer, Features } from '../components';

const Home: NextPage = () => {
  return (
    <div>
      <Navbar />

      <main className='mb-5'>
   <Hero />
      </main>
      <Features />

      <Footer />

    </div>
  );
};

export default Home;
