const postsPerRequest = 100;
const maxPostsPerFetch = 500;
const maxRequests = maxPostsPerFetch / postsPerRequest;

const responses = [];

const subreddit = "funnyvideos";

// const handleSubmit = ()=>{

// };



const fetchPosts = async (subreddit, afterParam)=>{
    const response = await fetch(
        `https://www.reddit.com/r/${subreddit}.json?limit=${postsPerRequest}${
          afterParam ? '&after=' + afterParam : ''
        }`
      ); 

    const responseJson = await response.json();

    responses.push(responseJson);

    if(responseJson.data.after && responses.length < maxRequests){
        fetchPosts(subreddit, responseJson.data.after);
        return;
    }

    parseResults(responses);
};

const parseResults = (responses)=>{
    const allPosts = [];

    responses.forEach(response =>{
        allPosts.push(...response.data.children)
    })

    allPosts.forEach(( {data:{secure_media}} )=>{
        // secure_media.forEach((sal)=>{
        //     console.log(sal);
        // })
        if(secure_media!=null){
            // console.log(secure_media)
        
            if(secure_media.reddit_video != null){

               const VIDEO_URL = secure_media.reddit_video.fallback_url;
               const AUDIO_URL = "https;//v.redd.it/" + VIDEO_URL.split('/')[3]+"/DASH_audio.mp4";

               console.log(`Video URL: ${VIDEO_URL}`);
               console.log(`Audio URL: ${AUDIO_URL}`);
            }

        }
        // if(secure_media.reddit_video!=null){
        //     console.log(secure_media.reddit_video);
        // }
    })

};

fetchPosts(subreddit);
// const handleSubmit = ()=>{
    
// };
