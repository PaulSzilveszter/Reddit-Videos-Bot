import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';

import {downloadFile, mergeFiles, downloadFiles} from "./Modules/FS_FunctionModule.mjs"
import {parseResults} from "./Modules/ParseModule.mjs"
import {Post} from "./Modules/ClassesModule.mjs"
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

    console.log(posts[0])

    // downloadFile(posts[0].video_url, "fisier.mp4");
    // downloadFile(posts[0].audio_url, "fisier.mp3");
   
    console.log("1");
    downloadFiles(posts[0], "file0");
    downloadFiles(posts[1], "file1");
   
    await new Promise(r => setTimeout(r, 2000));
    console.log("2");
    mergeFiles(posts[0], "file0");
    mergeFiles(posts[1], "file1");

    // await new Promise(r => setTimeout(r, 2000));
    // console.log("3");
};


fetchPosts(subreddit)