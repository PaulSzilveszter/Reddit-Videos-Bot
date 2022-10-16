export const OUTPUT_DIRECTORY_PATH = ".";
export const OUTPUT_DIRECTORY_NAME ="RedditBotVideos";

export const CHILD_PROCESS_DIR = {cwd: OUTPUT_DIRECTORY_PATH+"/"+OUTPUT_DIRECTORY_NAME}

export const postsPerRequest = 100;
export const maxPostsPerFetch = 300;
export const maxRequests = maxPostsPerFetch / postsPerRequest;

export const SUBREDDIT = "funnyvideos";

// Video creation parameters
//###########################################################

export const VIDEO_LENGTH = 150 // in seconds




//########## DATABASE ###########//
import * as fs from 'fs';

export let DATABASE = new Map();

fs.readFile("./database/database.txt", function(err, buf){
    console.log(buf.toString());
})



