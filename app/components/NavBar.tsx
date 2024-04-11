import { SignInButton} from '@farcaster/auth-kit';
import  { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { IconContext } from "react-icons";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <IconContext.Provider value={{ size: "1.6em"}}>
            <div>
                <div className='flex flex-row justify-between pl-12 pr-12 pt-10 pb-10'>
                    <div className='cursor-pointer text-xl md:text-3xl md:pl-10 md:pt-10 md:pb-6 lg:pl-24'>
                        ATLAS
                    </div>

                    <div className='hidden md:flex flex-row space-x-4 text-base text-gray-400'>
                        <div className='md:flex flex-row space-x-12 md:pr-10 md:pt-[45px] md:text-lg'>
                            <div className='hover:text-white cursor-pointer'>
                                Trending
                            </div>
                            <div className='hover:text-white cursor-pointer'>
                                Recommend
                            </div>
                            <div className='hover:text-white cursor-pointer'>
                                Save
                            </div>
                        </div>
                        <div className='md:hidden lg:flex lg:pr-28 lg:pt-[37px]'>
                            <SignInButton />
                        </div>
                           
                         
                    </div>
                    <div className='cursor-pointer md:hidden' onClick={toggleMenu}>
                            {isMenuOpen ? <RxCross1 />  : <RxHamburgerMenu />}
                    </div>
                </div>
                <div>
                     {isMenuOpen && (
                        <div className='min-h-65 border-4 border-[#1c1a1f] rounded-[25px]' style={{backgroundColor: '#1c1a1f'}}>
                            <ul className='text-lg p-16'>
                                <li className='cursor-pointer flex justify-center'>Trending</li>
                                <li className='cursor-pointer flex justify-center p-4'>Recommend</li>
                                <li className='cursor-pointer flex justify-center'>Save</li>
                                <li className='cursor-pointer flex justify-center p-4'><SignInButton /></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </IconContext.Provider>
    )
}
