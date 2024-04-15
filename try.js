

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



const checkFollowingCastAuthor = async (viewerFid, authorFid) => {
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
        
    return usersData[0].viewer_context.following
}
(async () => {
    try {
        let trendingCasts = await fetchTrendingCasts();
        
        trendingCasts.casts = trendingCasts.casts.filter(cast => {
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

        trendingCasts.casts.sort((a, b) => b.reactions.likes.length - a.reactions.likes.length);

    } catch (error) {
        console.error("Error fetching and sorting data:", error);
        return false;
    }
})();


(async () => {
    try {
        let trendingCasts = await fetchTrendingCasts();
        let trendingCastsByFollowing= [];
        const viewerFid = 32456;
        for (let i = 0; i < trendingCasts.casts.length; i++) {
            let isFollowing = await checkFollowingCastAuthor(viewerFid, trendingCasts.casts[i].author.fid);
            if (!isFollowing) continue
            trendingCastsByFollowing.push(trendingCasts.casts[i])
        }
        if (trendingCastsByFollowing.length == 0) return false;

        trendingCasts.casts = trendingCastsByFollowing;
        trendingCasts.casts = trendingCasts.casts.filter(cast => {
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

        trendingCasts.casts.sort((a, b) => b.reactions.likes.length - a.reactions.likes.length);

        console.log(trendingCasts.casts)

    } catch (error) {
        console.error("Error fetching and sorting data:", error);
        return false;
    }
})();

