import { useState, useEffect } from 'react';
import Image from 'next/image'

const imageLoader = ({ src, width, quality }: any) => {
    return src
}

interface BoxProps {
    routeName: string;

  }
  

export default function Box({routeName}: BoxProps) {
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
                console.log(fid)
                
                if (routeName == '/') {
                    let frames = await getTrendingFrames()
                    setBoxes(frames)
                }
            
                if (routeName == '/recommend' && fid > 0) {
                    let frames = await getRecommendedFrames(fid)
                    setBoxes(frames)
                }
            } catch (error) {
                console.error("Error fetching and sorting data:", error);
                return false;
            }
        })();
    }, [routeName]);

    const totalPages = Math.ceil(boxes.length / 20);

    const arrNo = Array.from({ length: totalPages }, (_, index) => index + 1);


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
            <div className="grid grid-cols-1 space-y-[43px] min-[280px]:pl-12 min-[280px]:pr-[53px] min-[360px]:pl-12 min-[360px]:pr-[53px] 
            min-[375px]:pl-12 min-[375px]:pr-[53px] min-[390px]:pl-12 min-[390px]:pr-[53px] min-[412px]:pl-12 min-[412px]:pr-[53px] 
            min-[414px]:pl-12 min-[414px]:pr-[53px] min-[430px]:pl-12 min-[430px]:pr-[53px] min-[540px]:pl-12 min-[540px]:pr-[53px] 
            min-[768px]:pl-[84px] min-[768px]:pr-[84px] min-[820px]:pl-[84px] min-[820px]:pr-[84px] min-[1024px]:pl-[140px] min-[1024px]:pr-[158px]">
               
                {boxes.slice(startIndex, startIndex + 40).map((y, index) => (
                    <div key={index}>
                        <div className="border-x border-t border-white/20">
                            <div className="flex justify-center bg-[#C6C8C3] ">
                                <div className="border-[38px] border-[#C6C8C3] ">
                                    <div className='shadow-2xl'>
                                    <Image 
                                        loader={imageLoader}
                                        src={y.frames[0].image}
                                        alt="Picture of the author"
                                        width={500}
                                        height={500}
                                    />
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                        <div className="border-x border-y border-white/20">
                            <div className="flex flex-col justify-center p-3">
                                <div className="flex justify-start text-[13px]">{y.frames[0].title || 'No Title Frame'}</div>
                                <div className="flex justify-start pt-3 text-[10px] text-gray-400">{getFormattedTimestamp(y.timestamp)} by @{y.author.username}</div>
                                <div className="flex justify-start text-[12px]">{trimText(y.text)}</div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className='flex flex-row space-x-[6px] justify-center'>
                    <div className={`pb-2 ${pageIdx === 0 ? 'text-gray-500' : ''}`} onClick={handleLeftArrowClick}>{"<"}</div>

                    <div className='flex flex-row space-x-[6px] justify-center '>
                        {arrNo.map((x, index) => (
                            <div className={`pt-[0.4px] ${pageIdx === index ? 'text-gray-500 underline' : ''}`} key={index} onClick={() => handleNumberClick(index)}>
                                {x}
                            </div>
                        ))}
                    </div>

                    <div className={`pb-2 ${pageIdx + 1 === totalPages ? 'text-gray-500' : ''}`}  onClick={handleRightArrowClick}>{">"}</div>
                </div>
             </div>
        </div>

    )
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

// write a filter 
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
        return !excludedDomains.includes(url.hostname.split('.').slice(-2).join('.'));
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
        const url = new URL(cast.embeds[0].url);
        return !excludedDomains.includes(url.hostname.split('.').slice(-2).join('.'));
    });

    trendingCasts.casts.sort((a: any, b: any) => b.reactions.likes.length - a.reactions.likes.length);

    return trendingCasts.casts
}