export const OUTPUT_DIRECTORY_PATH = ".";
export const OUTPUT_DIRECTORY_NAME ="RedditBotVideos";

export const CHILD_PROCESS_DIR = {cwd: OUTPUT_DIRECTORY_PATH+"/"+OUTPUT_DIRECTORY_NAME}

export const postsPerRequest = 100;
export const maxPostsPerFetch = 300;
export const maxRequests = maxPostsPerFetch / postsPerRequest;

export const SUBREDDIT = "MemeVideos";
export const CATEGORY = "/top"
export const TIMEFRAME = "week"


// Video creation parameters
//###########################################################

export const VIDEO_LENGTH = 420 // in seconds




//########## DATABASE ###########//
import * as fs from 'fs';

export let DATABASE = new Map();





