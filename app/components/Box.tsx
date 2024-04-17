import { useState, useEffect } from 'react';
import Image from 'next/image'

const imageLoader = ({ src, width, quality }: any) => {
    return src
}

interface BoxProps {
    routeName: string;
}
  

export default function Box({routeName}: BoxProps) {
    const [loading, setLoading] = useState(true); // State to track loading status
    const [boxes, setBoxes] = useState<any[]>([]);
    const [ pageIdx, setPageIdx ] = useState(0) 
    const [startIndex, setStartIndex] = useState(0);
  
    useEffect(() => {
        (async () => {
            try {
                const fidStr = localStorage.getItem('fid')
                let fid = 0;
                if (fidStr) {
                    fid = parseInt(fidStr)
                }
                
                if (routeName == '/') {
                    let frames = await getTrendingFrames()
                    setBoxes(frames)
                }
            
                if (routeName == '/recommend' && fid > 0) {
                    let frames = await getRecommendedFrames(fid)
                    setBoxes(frames)
                }
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error("Error fetching and sorting data:", error);
                setLoading(false); // Set loading to false in case of error
                return false;
            }
        })();
    }, [routeName]);

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

               <div className='grid grid-cols-1 gap-8  
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
                        {boxes.slice(startIndex, startIndex + boxesPerPage(pageIdx)).map((y, index) => (
                            <div key={index} className='' >
                                <div className="border-x border-t border-white/20 w-70 h-50">
                                    <div className="flex justify-center bg-[#F6F3E4] w-full h-full p-[38px]">
                                    <div className='flex justify-center'>
                                                <Image 
                                                    loader={imageLoader}
                                                    src={y.frames[0].image}
                                                    alt="Picture of the author"
                                                    width={250}
                                                    height={250}
                                                    layout="responsive"
                                                    style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.7)' }}
                                                />
                                            </div>
                                    </div>
                                </div>
                                <div className="border-x border-y border-white/20 w-70 h-24 cursor-pointer">
                                    <div className="flex flex-col justify-center p-3 text-white ">
                                        <div className="flex justify-start text-[16px] ">
                                            <div className='truncate'>{y.frames[0].title || 'No Title Frame'}</div>
                                        </div>
                                        <div className="flex justify-start pt-3 text-[10px] text-gray-400 truncate">{getFormattedTimestamp(y.timestamp)} by @{y.author.username}</div>
                                        <div className="flex justify-start pt-1 text-[12px]">
                                            <div className='truncate'>
                                                 {y.text}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

    
               </div>
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
             </div>
        </div>

    )
}

function onloadingScreen() {
    return ( <div className='flex justify-center font-semibold tracking-wide  text-gray-400' style={{paddingTop: '158px', paddingBottom: '40px'}}>
                Loading...
            </div> )
}

const fetchTrendingCasts = async () => {
    const response = await fetch('https://api.neynar.com/v2/farcaster/feed/frames?limit=100', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "api_key": "NEYNAR_API_DOCS",
        }
    });
    const dataJson = await response.json();
    return dataJson;
};

const getBulkFollowingFrameAuthors = async (viewerFid: number, authorFid: string) => {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${authorFid}&viewer_fid=${viewerFid}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "api_key": "NEYNAR_API_DOCS",
        }
    });
    const dataJson = await response.json();
    const usersData = dataJson.users 

    if (!usersData) return false; 
    
    return usersData
}

function getFormattedTimestamp(dateString: string) {
    const date = new Date(dateString);

    const options: any = { weekday: 'short', month: 'short', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate
}

function trimText(text: string) {
    if (typeof text !== 'string') {
        throw new Error('Input must be a string');
    }

    const maxLength = 40; 

    if (text.length <= maxLength) {
        return text;
    }

    let trimmedSentence = text.slice(0, maxLength); 
    if (trimmedSentence.length < text.length) {
        trimmedSentence += "...";
    }
    return trimmedSentence;
}

async function getRecommendedFrames(fid: number) {
    let trendingCasts = await fetchTrendingCasts();
    let trendingCastsByFollowing= [];
    let authurFids = [];

    for (let i = 0; i < trendingCasts.casts.length; i++) {
        authurFids.push(trendingCasts.casts[i].author.fid)
    }
    const encodedauthurFids = authurFids.join(',');
    const encodedQueryString = encodeURIComponent(encodedauthurFids);
    
    let frameAuthors = await getBulkFollowingFrameAuthors(fid, encodedQueryString)
    for (let i = 0; i < trendingCasts.casts.length; i++) {
        if (frameAuthors[i].viewer_context.following) {
            trendingCastsByFollowing.push(trendingCasts.casts[i])
        }
    }

    if (trendingCastsByFollowing.length == 0) return [];

    trendingCasts.casts = trendingCastsByFollowing;
    trendingCasts.casts = trendingCasts.casts.filter((cast: any) => {
        const excludedDomains = [
            "zora.co",
            "highlight.xyz",
            "manifold.xyz",
            "opensea.io",
            "foundation.app",
            "basepaint.xyz"
        ];
        
        if (cast.embeds[0].url === undefined) {
            return false
        }
        const url = new URL(cast.embeds[0].url);
        return !excludedDomains.includes(url.hostname.split('.').slice(-2).join('.')) && cast.author.power_badge;
    });

    trendingCasts.casts.sort((a: any, b: any) => b.reactions.likes.length - a.reactions.likes.length);
    return trendingCasts.casts
}

async function getTrendingFrames() {
    let trendingCasts = await fetchTrendingCasts();
    
      
    trendingCasts.casts = trendingCasts.casts.filter((cast: any) => {
        const excludedDomains = [
            "zora.co",
            "highlight.xyz",
            "manifold.xyz",
            "opensea.io",
            "foundation.app",
            "basepaint.xyz"
        ];
        
        if (cast.embeds[0].url === undefined) {
            return false
        }
        const validUrl = makeValidUrl(cast.embeds[0].url);
        if (!isValidUrl(validUrl)) {
            return
        }
        
        const url = new URL(validUrl);
        return !excludedDomains.includes(url.hostname.split('.').slice(-2).join('.')) && cast.author.power_badge;
    });

    return trendingCasts.casts
}

function makeValidUrl(url: string) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }
    return url;
}


function isValidUrl(url: string) {
    const pattern = /^(?:https?|ftp):\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/;
    return pattern.test(url);
}
