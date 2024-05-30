import { useState, useEffect } from 'react';
import Image from 'next/image'
import { usePathname } from 'next/navigation';
const imageLoader = ({ src, width, quality }: any) => {
    return src
}

interface BoxProps {
    routeName: string;
}

type FrameObject = {
    UserFid: string;
    DataId: string;
    FrameUrl: string;
}
export default function Box({routeName}: BoxProps) {
    const [loading, setLoading] = useState(true); // State to track loading status
    const [boxes, setBoxes] = useState<any[]>([]);
    const [ pageIdx, setPageIdx ] = useState(0) 
    const [startIndex, setStartIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSavedFrameSuccess, setSavedFrameSuccess] = useState(false);
    const [isRmFrameSuccess, setRmFrameSuccess] = useState(false);
    const [isEmptyBoxMsg, setEmptyBoxMsg] = useState("")
    const [frameObj, setFrameObj] = useState<FrameObject>({ UserFid: '', DataId: '', FrameUrl: '' });
    const [isSavedModalVisible, setIsSavedModalVisible] = useState(false);
    const [isRmModalVisible, setIsRmModalVisible] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const fidStr = sessionStorage.getItem('fid')
                let fid = 0;
                if (fidStr) {
                    fid = parseInt(fidStr)
                }
                
                if (routeName == '/') {
                    let frames = await getTrendingFrames()
                    setBoxes(frames)
                    setEmptyBoxMsg("No Trending Frames")
                }
            
                if (routeName == '/recommend') {
                    if (fid > 0) {
                        let frames: any;
                        if (fidStr) {
                            frames = await getRecommendedFrames(fidStr)
                            console.log(frames)
                        }
                            setBoxes(frames)
                    }
                    setEmptyBoxMsg("Your Followings Are Yet To Make A Frame Post")
                }

                if (routeName == '/save') {
                    
                    if (fid > 0) {
                        let frames: any;
                        if (fidStr) {
                            frames = await getSavedFrames(fidStr)
                        }
                        setBoxes(frames)
                    }
                    setEmptyBoxMsg("You Do Not Have Any Saved Frames")
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching and sorting data:", error);
                setLoading(false);
                return false;
            }
        })();
    }, [routeName]);

        useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        // Clean up the effect when the component unmounts
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isModalOpen]);

    const toggleModal = (f: {DataId: string, FrameUrl: string}) => {
        let fidStr = sessionStorage.getItem('fid') || ""
   
        setFrameObj({UserFid: fidStr, DataId: f.DataId, FrameUrl: f.FrameUrl})
        
        setIsModalOpen(!isModalOpen);
    };
    const toggleModalClose = () => {
        setIsModalOpen(!isModalOpen);
    };
    if (loading) {
        return onloadingScreen()
    }
    
    const totalPages = Math.ceil(boxes.length / 20);
    const remainingBoxes = boxes.length % 20;
    const arrNo = Array.from({ length: totalPages }, (_, index) => index + 1);

    const boxesPerPage = (pageIndex: number) => {
        if (pageIndex < totalPages - 1) {
          return 20; 
        } else {
          return remainingBoxes; 
        }
    };


    const handleNumberClick = (index: number) => {
        setPageIdx(index)
        setStartIndex(index * 20);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLeftArrowClick = () => {
        let newPageIdx = pageIdx - 1
        if (newPageIdx >= 0) {
            setStartIndex(newPageIdx * 20);
            setPageIdx(newPageIdx)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    const handleRightArrowClick = () => {
        let newPageIdx = pageIdx + 1
        if (newPageIdx < totalPages) {
            setStartIndex(newPageIdx * 20);
            setPageIdx(newPageIdx)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleUserSaveOrRemove = async (DataId: string, UserFid: string) => {
        toggleModal({ DataId: "", FrameUrl: "" });
        if (UserFid == "") {
            return
        }
        let resp: any;
        if (routeName == "/save") {
          resp = await removeUserFrames(UserFid, DataId);
          if (resp.isRMSuccessful) {
            setBoxes((prevBoxes) => prevBoxes.filter((frame) => frame.dataId !== DataId));
            setRmFrameSuccess(true);
          } else {
            setRmFrameSuccess(false);
          }
          showRmModal();
        } else {
          resp = await saveUserFrames(UserFid, DataId);
          if (resp.isPutSuccessful) {
            setSavedFrameSuccess(true);
          } else {
            setSavedFrameSuccess(false);
          }
          showSavedModal();
        }
      };

    const showSavedModal = () => {
        setIsSavedModalVisible(true);
        setTimeout(() => {
            setIsSavedModalVisible(false);
        }, 5500);
    }
    const showRmModal = () => {
        setIsRmModalVisible(true);
        setTimeout(() => {
            setIsRmModalVisible(false);
        }, 5500);
    }


    const preventPropagation = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div style={{paddingTop: '108px'}}>
            <div className="
            min-[280px]:pl-12 min-[280px]:pr-[53px]
            min-[360px]:pl-12 min-[360px]:pr-[53px] 
            min-[375px]:pl-12 min-[375px]:pr-[53px] 
            min-[390px]:pl-12 min-[390px]:pr-[53px] 
            min-[412px]:pl-12 min-[412px]:pr-[53px] 
            min-[414px]:pl-12 min-[414px]:pr-[53px] 
            min-[430px]:pl-12 min-[430px]:pr-[53px]
            min-[540px]:pl-12 min-[540px]:pr-[53px] 
            min-[768px]:pl-[84px] min-[768px]:pr-[84px]
            min-[820px]:pl-[84px] min-[820px]:pr-[84px] 
            min-[1024px]:pl-[140px] min-[1024px]:pr-[158px]">
               
            {boxes.length === 0 ? (
                     <div className="text-center text-white">
                         {isEmptyBoxMsg}
                     </div>
            ) : (
                <div className='grid grid-cols-1 gap-10 
                    min-[280px]:grid min-[280px]:grid-cols-1 min-[280px]:gap-12
                    min-[360px]:grid min-[360px]:grid-cols-1 min-[360px]:gap-12
                    min-[375px]:grid min-[375px]:grid-cols-1 min-[375px]:gap-12
                    min-[390px]:grid min-[390px]:grid-cols-1 min-[390px]:gap-12
                    min-[412px]:grid min-[412px]:grid-cols-1 min-[412px]:gap-12
                    min-[414px]:grid min-[414px]:grid-cols-1
                    min-[430px]:grid min-[430px]:grid-cols-1
                    min-[540px]:grid min-[540px]:grid-cols-1
                    min-[768px]:grid min-[768px]:grid-cols-2
                    min-[820px]:grid min-[820px]:grid-cols-2
                    min-[1024px]:grid min-[1024px]:grid-cols-3 justify-center
                    
                '>
                    {boxes.slice(startIndex, startIndex + boxesPerPage(pageIdx)).map((frame, index) => (
                                <div key={index} className='' >
                                    <div className="border-x border-t border-white/20 w-70 h-50">
                                        <div className="flex justify-center bg-[#FFFFFF] w-full h-[16rem] p-[38px]">
                                                <div className='flex justify-center'>
                                                    <Image 
                                                        loader={imageLoader}
                                                        src={frame.image_url}
                                                        alt="Picture of the author"
                                                        width={250}
                                                        height={250}
                                                        style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.7)' }}
                                                    />
                                                </div>
                                        </div>
                                    </div> 
                                    <div className="bg-black border-x border-y border-white/20 w-70 h-24 cursor-pointer" onClick={() => toggleModal({DataId: frame.dataId, FrameUrl: frame.frames_url})}>
                                        <div className="flex flex-col justify-center p-3 text-white ">
                                            <div className="flex justify-start text-[16px] ">
                                                <div className='truncate'>{frame.frames_title || 'No Title Frame'}</div>
                                            </div>
                                            <div className="flex justify-start pt-3 text-[10px] text-gray-400 truncate">{getFormattedTimestamp(frame.timestamp)} by @{frame.author_username}</div>
                                            <div className="flex justify-start pt-1 text-[12px]">
                                                <div className='truncate'>
                                                    {frame.text}
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                <div>
                    {isModalOpen && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm' onClick={() => toggleModal({DataId: "", FrameUrl: ""})}>
                            <div className='min-h-65 border-4 border-black  text-white rounded-[25px]' style={{backgroundColor: 'black'}} onClick={preventPropagation}>
                                <div className='p-16 space-y-4'>
                                <div className='font-bold'>What would you do ?</div>
                                    <a href={frameObj.FrameUrl} onClick={() => toggleModal({DataId: "", FrameUrl: ""})} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center bg-red-600 border-[1px] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer' >View on Warpcast</a>
                                    <div className='flex items-center justify-center'>or</div>
                                    <div onClick={async () =>await handleUserSaveOrRemove(frameObj.DataId, frameObj.UserFid)} className='flex items-center justify-center border-[1px] p-2 pl-4 pr-4 rounded-[25px] cursor-pointer'>{routeName == "/save" ? "Remove" : "Save"}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {boxes.length > 0 && (
                    <div className='flex flex-row space-x-[6px] justify-center pt-[48px]'>
                        <div className={`cursor-pointer pb-2 ${pageIdx === 0 ? 'text-gray-500' : 'text-white'}`} onClick={handleLeftArrowClick}>{"<"}</div>
                        <div className='flex flex-row space-x-[6px] justify-center text-white'>
                            {arrNo.map((x, index) => (
                                <div className={`cursor-pointer pt-[0.4px] ${pageIdx === index ? 'text-gray-500 underline' : ''}`} key={index} onClick={() => handleNumberClick(index)}>
                                    {x}
                                </div>
                            ))}
                        </div>
                        <div className={`pb-2 cursor-pointer ${pageIdx + 1 === totalPages ? 'text-gray-500' : 'text-white'}`}  onClick={handleRightArrowClick}>{">"}</div>
                    </div>
                )}
                 {isSavedModalVisible && (
                    <div className='fixed bottom-0 left-0 right-0 flex items-center justify-center pb-4'>
                        <div className={`${isSavedFrameSuccess ? 'bg-green-500' : 'bg-red-500'} text-white py-2 px-4 rounded shadow-lg transition-opacity duration-500`}>
                           { isSavedFrameSuccess ? "Successfully, Saved!" : "Already, Exists!" } 
                        </div>
                    </div>
                )}
                 {isRmModalVisible && (
                    <div className='fixed bottom-0 left-0 right-0 flex items-center justify-center pb-4'>
                        <div className='bg-red-500 text-white py-2 px-4 rounded shadow-lg transition-opacity duration-500'>
                           { isRmFrameSuccess ? "Successfully, Removed!" : "" } 
                        </div>
                    </div>
                )}
             </div>
        </div>
    )
}

function onloadingScreen() {
    return ( <div className='flex justify-center font-semibold tracking-wide  text-gray-400' style={{paddingTop: '158px', paddingBottom: '40px'}}>
                Loading...
            </div> )
}

function getFormattedTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', month: 'short', day: '2-digit'
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

async function getRecommendedFrames(fid: string) {
    if (fid == "") {
        return 
    }
    try {
        let response: any;
        let dataJson: any;
        let recommendedUrl = process.env.NEXT_PUBLIC_RECOMMENDED_FRAME_URL
        if (recommendedUrl) {
            response = await fetch(recommendedUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" +  " " + process.env.NEXT_PUBLIC_AUTH_KEY,
                },
                body: JSON.stringify({
                    "viewer_fid": fid,
                })
            });
            dataJson = await response.json();
        }
        return dataJson;
    } catch (error) {
        console.error("Error fetching trending frames:", error);
        return []
    }
}

async function getTrendingFrames() {
    try {
        let response: any;
        let dataJson: any;
        let trendingUrl = process.env.NEXT_PUBLIC_TRENDING_FRAME_URL
        if (trendingUrl) {
            response = await fetch(trendingUrl, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" +  " " + process.env.NEXT_PUBLIC_AUTH_KEY,
                }
            });
            dataJson = await response.json();
        }
        
        return dataJson;
    } catch (error) {
        console.error("Error fetching trending frames:", error);
        return []
    }
}

async function getSavedFrames(userfid: string) {
    if (userfid == "") {
        return 
    }
    try {
        let response: any;
        let dataJson: any;
        let savedFramesUrl = process.env.NEXT_PUBLIC_SAVED_USER_FRAMES_URL
        if (savedFramesUrl) {
            response = await fetch(savedFramesUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" +  " " + process.env.NEXT_PUBLIC_AUTH_KEY,
                },
                body: JSON.stringify({
                    "user_fid": userfid,
                })
            });
            dataJson = await response.json();
        }
        return dataJson;
    } catch (error) {
        console.error("Error fetching trending frames:", error);
        return []
    }
}

async function saveUserFrames(userfid: string, dataid: string) {
    if (userfid && userfid == "") {
        return
    }
    try {
        let response: any;
        let dataJson: any;
        let saveUserFrameUrl = process.env.NEXT_PUBLIC_SAVE_USER_FRAME_URL
        if (saveUserFrameUrl) {
            response = await fetch(saveUserFrameUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" +  " " + process.env.NEXT_PUBLIC_AUTH_KEY,
                },
                body: JSON.stringify({
                    "user_fid": userfid,
                    "dataid": dataid
                })
            });
            dataJson = await response.json();
        }
        
        return dataJson;
    } catch (error) {
        console.error("Error saving user frames:", error);
        return []
    }
}

async function removeUserFrames(userfid: string, dataid: string) {
    if (userfid && userfid == "") {
        return 
    }
    try {
        let response: any;
        let dataJson: any;
        let rmUserFrameUrl = process.env.NEXT_PUBLIC_RM_USER_FRAMES_URL
        if (rmUserFrameUrl) {
            response = await fetch(rmUserFrameUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" +  " " + process.env.NEXT_PUBLIC_AUTH_KEY,
                },
                body: JSON.stringify({
                    "user_fid": userfid,
                    "dataid": dataid
                })
            });
            dataJson = await response.json();
        }
        return dataJson;
    } catch (error) {
        console.error("Error removing user frames:", error);
        return []
    }
}






