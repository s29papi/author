'use client';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider} from '@farcaster/auth-kit';
import NavBar from "./NavBar";
import Header from "./Header";
import Box from "./Box";
import Footer from "./Footer";
import { useState } from 'react';

{/**
  1. NavBar: A responsive navigation bar
  2. Header
  3. Box/Dynamic Card Box
  4. Footer
*/}
interface PageLayoutProps {
    routeName: string;
  }
  

const config = {
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/WYqLLFC8PL_vzejykc3fwfS_JpbvpI66',
    siweUri: "https://example.com/login",
    domain: "author-pi.vercel.app",
    relay: 'https://relay.farcaster.xyz',
  };

export default function PageLayout({ routeName }: PageLayoutProps) {
    const [fid, setFid] = useState<number>(0);
    const handleFidChange = (newFid: number) => {
        setFid(newFid);
    };
    
    
    
    return (      
            <AuthKitProvider config={config}>
                <div className='flex flex-col min-h-screen' style={{backgroundColor: '#131115'}}>
                    <NavBar onFidChange={handleFidChange}/>
                    <Header/>
                    <Box routeName={routeName} />
                    <Footer/>
                </div>
            </AuthKitProvider>
    )
}