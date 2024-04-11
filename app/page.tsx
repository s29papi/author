'use client';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider} from '@farcaster/auth-kit';
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Box from "./components/Box";


{/**
  1. NavBar: A responsive navigation bar
  2. Header
  3. Box/Dynamic Card Box
  4. Footer
*/}

const config = {
  rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/WYqLLFC8PL_vzejykc3fwfS_JpbvpI66',
  siweUri: "https://example.com/login",
  domain: "example.com",
  relay: 'https://relay.farcaster.xyz',
};

export default function Home() {
  return (
    <main>
      <div className='flex flex-col min-h-screen' style={{backgroundColor: '#131115'}}>
      <NavBar/>
      <Header/>
      </div>
    </main>
  );
}

