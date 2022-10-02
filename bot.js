let posts =[]

class Post{
    constructor(video_url, audio_url){
        this.video_url = video_url
        this.audio_url = audio_url
    }
    get getVideoURL(){
        return this.video_url;
    }
    get getAudioURL(){
        return this.audio_url;
    }
}

const postsPerRequest = 100;
const maxPostsPerFetch = 300;
const maxRequests = maxPostsPerFetch / postsPerRequest;



const subreddit = "funnyvideos";

// const handleSubmit = ()=>{

// };

const responses = [];

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
    
    console.log(posts);
};

const parseResults = (responses)=>{
    const allPosts = [];

    responses.forEach(response =>{
        allPosts.push(...response.data.children)
    })

    allPosts.forEach(( {data:{secure_media}} )=>{
    
        if(secure_media!=null){
        
        
            if(secure_media.reddit_video != null){

               const VIDEO_URL = secure_media.reddit_video.fallback_url;
               const AUDIO_URL = "https;//v.redd.it/" + VIDEO_URL.split('/')[3]+"/DASH_audio.mp4";

            //    console.log(`Video URL: ${VIDEO_URL}`);
            //    console.log(`Audio URL: ${AUDIO_URL}`);

                posts.push(new Post(VIDEO_URL, AUDIO_URL));
            }

        }
        
    })
    
};

fetchPosts(subreddit)