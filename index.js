import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';

import {downloadFile} from "./FS_FunctionModule.mjs"
import {parseResults} from "./ParseModule.mjs"
import {Post} from "./ClassesModule.mjs"
// const https = require('https'); 
// const fs = require('fs');




let posts = []



const postsPerRequest = 100;
const maxPostsPerFetch = 300;
const maxRequests = maxPostsPerFetch / postsPerRequest;



const subreddit = "funnyvideos";

// const handleSubmit = ()=>{

// };

const responses = [];

const fetchPosts = async (subreddit, afterParam) => {
    const response = await fetch(
        `https://www.reddit.com/r/${subreddit}.json?limit=${postsPerRequest}${afterParam ? '&after=' + afterParam : ''
        }`
    );

    const responseJson = await response.json();

    responses.push(responseJson);

    if (responseJson.data.after && responses.length < maxRequests) {
        fetchPosts(subreddit, responseJson.data.after);
        return;
    }

    posts.push(...parseResults(responses));

    // console.log(posts);

    downloadFile(posts[0].video_url, "fisier.mp4");
};


fetchPosts(subreddit)