import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';
import * as child_process from 'child_process';

import { SUBREDDIT, postsPerRequest, maxPostsPerFetch, maxRequests, OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME } from "./running_parameters.js";

import { Post } from "./Modules/ClassesModule.mjs";
import { parseResults } from "./Modules/ParseModule.mjs";
import { mergeAudioAndVideoFiles, downloadAudioAndVideoFiles , mergeTwoVideoFiles, deleteUnnecesaryFiles} from "./Modules/FS_FunctionModule.mjs";
import {getVideoDuration} from "./Modules/FfmpegModule.mjs";
import { deleteFile } from "./Modules/ErrorHandlingModule.mjs";




let posts = []
const responses = [];

const fetchAndRun = async (subreddit, afterParam) => {

    {
        const response = await fetch(
            `https://www.reddit.com/r/${subreddit}.json?limit=${postsPerRequest}${afterParam ? '&after=' + afterParam : ''
            }`
        );

        const responseJson = await response.json();

        responses.push(responseJson);

        if (responseJson.data.after && responses.length < maxRequests) {
            fetchAndRun(subreddit, responseJson.data.after);
            return;
        }

        posts.push(...parseResults(responses));
    }

    // Running the program
    //###########################################



    console.log("\n1. Downloading ");
    downloadAudioAndVideoFiles(posts[0], "file0");
    downloadAudioAndVideoFiles(posts[1], "file1");

    await new Promise(r => setTimeout(r, 2000));

    console.log("\n2. Merging audio with video");
    mergeAudioAndVideoFiles(posts[0], "file0");
    mergeAudioAndVideoFiles(posts[1], "file1");

    await new Promise(r => setTimeout(r, 2000));

    console.log("\n3. Merging video files");
    mergeTwoVideoFiles("file0_output", "file1_output", "output");

    await new Promise(r => setTimeout(r, 2000));

    console.log("\n4. Checking Video length");
    console.log(await getVideoDuration('output.mp4'));

    deleteUnnecesaryFiles()

};


fetchAndRun(SUBREDDIT)