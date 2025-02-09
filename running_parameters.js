export const OUTPUT_DIRECTORY_PATH = ".";
export const OUTPUT_DIRECTORY_NAME ="RedditBotVideos";

export const CHILD_PROCESS_DIR = {cwd: OUTPUT_DIRECTORY_PATH+"/"+OUTPUT_DIRECTORY_NAME}

export const postsPerRequest = 100;
export const maxPostsPerFetch = 1000;
export const maxRequests = maxPostsPerFetch / postsPerRequest;

export const SUBREDDIT = "MemeVideos";
export const CATEGORY = "/top"
export const TIMEFRAME = "year"


// Video creation parameters
//###########################################################
export const MAX_SUBVIDEO_LENGTH = 30;
export const VIDEO_LENGTH = 420 // in seconds
export const ASPECT_RATIO = "1920:1080"; //EX ASPECT RATIO "1280:720"
export const UPDATE_DATABASE  = true;


//########## DATABASE ###########//
import * as fs from 'fs';

export let DATABASE = new Map();





