import { SignInButton } from '@farcaster/auth-kit';
import { useState, useEffect } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { IconContext } from "react-icons";
import { useRouter, usePathname } from 'next/navigation';


import { useProfile } from '@farcaster/auth-kit';
import Image from 'next/image'


interface NavBarProps {
    onFidChange: (fid: number) => void; 
}

export default function NavBar({ onFidChange }: NavBarProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false);
    const [profileArray, setProfileArray] = useState<any[]>([]);
    const {
        profile: { username, pfpUrl },
      } = useProfile();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            setIsSignedIn(true);
        }
    }, []);

    useEffect(() => {
        const username = sessionStorage.getItem('username')
        const pfpUrl = sessionStorage.getItem('pfpUrl')
        const fid = sessionStorage.getItem('fid')
        if (fid && username && pfpUrl) {
            setProfileArray([pfpUrl, username, fid]);
        }
    }, []);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignInSuccess = (fid: number, username: string, pfpUrl: string) => {
        sessionStorage.setItem('authToken', 'aaaa-bbbb-cccc-dddd');
        setIsSignedIn(true);
        onFidChange(fid); 
        if (username && pfpUrl && fid) {
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('pfpUrl', pfpUrl);
            sessionStorage.setItem('fid', fid.toString());
        }

        if (fid && username && pfpUrl) {
            setProfileArray([pfpUrl, username, fid]);
        }
        sessionStorage.setItem('justSignedIn', "true")
    };

    const handleSignOut = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('pfpUrl');
        sessionStorage.removeItem('fid');
        setIsSignedIn(false);
    };

    const handleProfileButtonClicked = () => {
        if (isProfileButtonClicked) {
            setIsProfileButtonClicked(false)
            return
        }
        
        if (sessionStorage.getItem('justSignedIn') == "true") {
            sessionStorage.removeItem('justSignedIn');
            return
        }
        
        setIsProfileButtonClicked(true) 
    }

    const handleNavButtonClick = (navbutton: string) => {
        router.push(`/${navbutton}`);
        
    }

    return (
        <IconContext.Provider value={{ size: "1.6em", color: "white"}}>
            <div style={{ position: "fixed", width: "100%", zIndex: 1000, backgroundColor: "black"}}>
                <div className='flex flex-row justify-between pl-12 pr-12 pt-10 pb-10
                min-[768px]:pt-2 min-[768px]:pb-2
                '>
                    <div className='cursor-pointer text-white text-xl md:text-3xl md:pl-10 md:pt-10 md:pb-6 lg:pl-24' onClick={() => handleNavButtonClick('trending')}>
                        ATLAS
                    </div>

                    <div className='hidden md:flex flex-row  text-base text-gray-400'>
                        <div className='md:flex flex-row space-x-8 md:pr-10 md:pt-[45px] md:text-lg'>
                            <div className={`${usePathname() == '/' ? 'text-white' : ''} cursor-pointer`} onClick={() => handleNavButtonClick('trending')}>
                                Trending
                            </div>
                            <div className={`${usePathname() == '/recommend' ? 'text-white' : 'hover:text-white'}  cursor-pointer`} onClick={() => handleNavButtonClick('recommend')}>
                                Recommend
                            </div>
                            <div className={`${usePathname() == '/save' ? 'text-white' : 'hover:text-white'}  cursor-pointer`} onClick={() => handleNavButtonClick('save')}>
                                Save
                            </div>
                        </div>
                        <div className='md:hidden lg:flex lg:pr-28 lg:pt-[37px]'>
                            {isSignedIn ? (
                                    <div className='flex flex-col space-y-2'>
                                        <div className='flex flex-row cursor-pointer p-2 px-4 space-x-2 border border-white/20 rounded-lg' onClick={handleProfileButtonClicked}>
                                                <div>
                                                    <Image 
                                                        loader={imageLoader}
                                                        src={profileArray[0]}
                                                        alt="Picture of the author"
                                                        width={28}
                                                        height={28}
                                                        style={{
                                                            borderRadius: "50%"
                                                        }}
                                                    />
                                                </div>
                                
                                                <div>{profileArray[1]}</div>
                                        </div>

                                        <div className='flex justify-end'>
                                            { isProfileButtonClicked ? 
                                                <button className='flex flex-row cursor-pointer p-2 px-4 space-x-2 border border-white/20 rounded-lg' onClick={handleSignOut}>Sign Out</button> 
                                                :
                                                ""
                                            }
                                        </div>   
                                    </div>
                            ) : (
                                <SignInButton
                                    onSuccess={({ fid }) => {
                                        if (fid && username && pfpUrl) handleSignInSuccess(fid, username, pfpUrl)}
                                    } 
                                />
                            )}
                        </div>
                    </div>
                    <div className='cursor-pointer md:hidden' onClick={toggleMenu}>
                        {isMenuOpen ? <RxCross1 />  : <RxHamburgerMenu />}
                    </div>
                </div>
                <div>
                    {isMenuOpen && (
                        <div className='min-h-65 border-4 border-[#1c1a1f]  text-white rounded-[25px]' style={{backgroundColor: '#1c1a1f'}}>
                            <ul className='text-lg p-16'>
                                <li className='cursor-pointer flex justify-center' onClick={() => router.push('/trending')}>Trending</li>
                                <li className='cursor-pointer flex justify-center p-4' onClick={() => router.push('/recommend')}>Recommend</li>
                                <li className='cursor-pointer flex justify-center' onClick={() => router.push('/save')}>Save</li>
                                <li className='cursor-pointer flex justify-center p-4'>
                                    {isSignedIn ? (
                                        <div className='flex flex-col space-y-2'>
                                            <div className='flex flex-row cursor-pointer p-2 px-4 space-x-2 border border-white/20 rounded-lg' onClick={handleProfileButtonClicked}>
                                                    <div>
                                                        <Image 
                                                            loader={imageLoader}
                                                            src={profileArray[0]}
                                                            alt="Picture of the author"
                                                            width={28}
                                                            height={28}
                                                            style={{
                                                                borderRadius: "50%"
                                                            }}
                                                        />
                                                    </div>       
                                                    <div>{profileArray[1]}</div>
                                            </div>
    
                                            <div className='flex justify-end'>
                                                { isProfileButtonClicked ? 
                                                    <button className='flex flex-row cursor-pointer p-2 px-4 space-x-2 border border-white/20 rounded-lg' onClick={handleSignOut}>Sign Out</button> 
                                                    :
                                                    ""
                                                }
                                            </div>   
                                        </div>
                                    ) : (
                                        <SignInButton
                                            onSuccess={({ fid }) => {
                                                if (fid && username && pfpUrl) handleSignInSuccess(fid, username, pfpUrl)}
                                            } 
                                        />
                                    )}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </IconContext.Provider>
    );
}


const imageLoader = ({ src, width, quality }: any) => {
    return src
}




