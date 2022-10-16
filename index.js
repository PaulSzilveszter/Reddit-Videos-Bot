import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';
import * as child_process from 'child_process';

import { SUBREDDIT, postsPerRequest, maxPostsPerFetch, maxRequests, OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME, VIDEO_LENGTH, DATABASE } from "./running_parameters.js";

import { Post } from "./Modules/ClassesModule.mjs";
import { parseResults } from "./Modules/ParseModule.mjs";
import { mergeAudioAndVideoFiles, downloadAudioAndVideoFiles, mergeTwoVideoFiles, deleteUnnecesaryFiles, deleteUnnecesaryFiles2 } from "./Modules/FS_FunctionModule.mjs";
import { getVideoDuration } from "./Modules/FfmpegModule.mjs";
import { deleteFile } from "./Modules/ErrorHandlingModule.mjs";


let currentVideoLength = 0
let currentVideoIndex = 0;

let posts = []
const responses = [];


console.log(DATABASE.get(""));

function formatVideos(currentVideoIndex, VIDEO_LENGTH, posts) {
    while (currentVideoLength < VIDEO_LENGTH) {


        console.log("#########################")
        console.log(currentVideoIndex, "\nlength:", currentVideoLength);
        console.log("=========================");


        if (currentVideoIndex === 0) {

            console.log("\n1. Downloading ");
            downloadAudioAndVideoFiles(posts[0], "file0");



            //deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "temp_output.mp4");

            downloadAudioAndVideoFiles(posts[1], "file1");


            // deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "temp_output.mp4");

            console.log("\n2. Merging audio with video");
            mergeAudioAndVideoFiles(posts[0], "file0");



            mergeAudioAndVideoFiles(posts[1], "file1");



            console.log("\n3. Merging video files");
            // await new Promise(r => setTimeout(r, 1500));
            mergeTwoVideoFiles("file0_output", "file1_output", 'output' + currentVideoIndex);

            // await new Promise(r => setTimeout(r, 1500));

            console.log("\n4. Checking Video length");

            let length = getVideoDuration('output' + currentVideoIndex + '.mp4')

            console.log(length);

            currentVideoLength += length;

            deleteUnnecesaryFiles();

        }
        else {

            console.log("\n1. Downloading ");
            downloadAudioAndVideoFiles(posts[currentVideoIndex + 1], "file0");




            console.log("\n2. Merging audio with video");
            mergeAudioAndVideoFiles(posts[currentVideoIndex + 1], "file0");



            console.log("\n3. Merging video files");

            mergeTwoVideoFiles("file0_output", "output" + (currentVideoIndex - 1), 'output' + currentVideoIndex);



            console.log("\n4. Checking Video length");

            let length = getVideoDuration("file0_output" + '.mp4')

            console.log(length);

            currentVideoLength += length;

            deleteUnnecesaryFiles2();
            deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "output" + (currentVideoIndex - 1) + ".mp4");
        }





        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&\n")



        currentVideoIndex++;


    }
}

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

    formatVideos(currentVideoIndex, VIDEO_LENGTH, posts);

    // while (currentVideoLength < VIDEO_LENGTH) {
    //     await new Promise(r => setTimeout(r, 1000));

    //     console.log("#########################")
    //     console.log(currentVideoIndex, "\nlength:", currentVideoLength);
    //     console.log("=========================");


    //     if (currentVideoIndex === 0) {

    //         console.log("\n1. Downloading ");
    //         downloadAudioAndVideoFiles(posts[0], "file0");


    //         await new Promise(r => setTimeout(r, 1500));
    //         //deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "temp_output.mp4");

    //         downloadAudioAndVideoFiles(posts[1], "file1");

    //         await new Promise(r => setTimeout(r, 1500));
    //         // deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "temp_output.mp4");

    //         console.log("\n2. Merging audio with video");
    //         await mergeAudioAndVideoFiles(posts[0], "file0");

    //         await new Promise(r => setTimeout(r, 1500));

    //         await mergeAudioAndVideoFiles(posts[1], "file1");

    //         await new Promise(r => setTimeout(r, 1500));

    //         console.log("\n3. Merging video files");
    //         // await new Promise(r => setTimeout(r, 1500));
    //         mergeTwoVideoFiles("file0_output", "file1_output", 'output' + currentVideoIndex);

    //         // await new Promise(r => setTimeout(r, 1500));

    //         console.log("\n4. Checking Video length");

    //         let length = await getVideoDuration('output' + currentVideoIndex+ '.mp4')

    //         console.log(length);

    //         currentVideoLength += length;

    //         deleteUnnecesaryFiles();

    //     }
    //     else {

    //         console.log("\n1. Downloading ");
    //         downloadAudioAndVideoFiles(posts[currentVideoIndex + 1], "file0");


    //         await new Promise(r => setTimeout(r, 1500));

    //         console.log("\n2. Merging audio with video");
    //         mergeAudioAndVideoFiles(posts[currentVideoIndex + 1], "file0");

    //         await new Promise(r => setTimeout(r, 1500));

    //         console.log("\n3. Merging video files");
    //         await new Promise(r => setTimeout(r, 1500));
    //         mergeTwoVideoFiles("file0_output", "output" + (currentVideoIndex - 1), 'output' + currentVideoIndex);

    //         await new Promise(r => setTimeout(r, 1500));

    //         console.log("\n4. Checking Video length");

    //         let length = await getVideoDuration("file0_output" + '.mp4')

    //         console.log(length);

    //         currentVideoLength += length;

    //         deleteUnnecesaryFiles2();
    //         deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "output" + (currentVideoIndex - 1) + ".mp4");
    //     }





    //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&\n")

    //     // currentVideoLength += 30;

    //     currentVideoIndex++;


    // }

    // console.log(currentVideoLength);

};


fetchAndRun(SUBREDDIT)