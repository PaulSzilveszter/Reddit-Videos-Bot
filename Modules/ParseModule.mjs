// import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';

import { Post } from './ClassesModule.mjs';

export const parseResults = (responses) => {
    const posts = []

    const allPosts = [];

    responses.forEach(response => {
        allPosts.push(...response.data.children)
    })

    allPosts.forEach(({ data: { secure_media } }) => {

        if (secure_media != null) {


            if (secure_media.reddit_video != null) {

                const VIDEO_URL = secure_media.reddit_video.fallback_url;
                const AUDIO_URL = "https://v.redd.it/" + VIDEO_URL.split('/')[3] + "/DASH_audio.mp4";

                //    console.log(`Video URL: ${VIDEO_URL}`);
                //    console.log(`Audio URL: ${AUDIO_URL}`);

                posts.push(new Post(VIDEO_URL, AUDIO_URL));
            }

        }

    })

    return posts;
};
