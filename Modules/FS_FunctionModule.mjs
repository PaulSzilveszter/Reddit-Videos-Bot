import * as https from 'https';
import * as fs from 'fs';
import * as child_process from 'child_process';

import {OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME} from "../running_parameters.js";

import { handleChildProcessErros, deleteFile } from './ErrorHandlingModule.mjs';
import { stderr, stdout } from 'process';

function initializeOutputDirectory(filepath) {
    const FINAL_PATH = filepath + `/${OUTPUT_DIRECTORY_NAME}`;
    
    const exists = fs.existsSync(FINAL_PATH);
    if (exists === true) {

        return FINAL_PATH;

    }
    fs.mkdirSync(FINAL_PATH);

    return FINAL_PATH;
}

function downloadFile(URL, filename) {

    const initializedDirectory = initializeOutputDirectory(OUTPUT_DIRECTORY_PATH)+"/"+filename;

    const file = fs.createWriteStream(initializedDirectory);

    const request = https.get(URL, function (response) {

        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log(`Downloaded ${filename}`);
        });
    });
}

export function downloadAudioAndVideoFiles(post, filename){
    downloadFile(post.video_url, filename+".mp4");
    downloadFile(post.audio_url, filename+".mp3");
    
    
}

export function mergeAudioAndVideoFiles(post, filename){
    child_process.exec(`ffmpeg -i ${filename}.mp4 -i ${filename}.mp3 -c copy ${filename}_output.mp4`
    ,
    {cwd: `./${OUTPUT_DIRECTORY_NAME}`}
    ,
    (error, stdout, stderr)=>{handleChildProcessErros(error, stdout, stderr)}
    );
    
    console.log(`Merged ${filename}`);
    


}

export function mergeTwoVideoFiles(filename1, filename2, outputVideoName){
    child_process.exec(`ffmpeg -i ${filename1}.mp4 -c copy intermediate1.ts
    ffmpeg -i ${filename2}.mp4 -c copy intermediate2.ts
    ffmpeg -i "concat:intermediate1.ts|intermediate2.ts" -c copy ${outputVideoName}.mp4`
    ,
    {cwd: `./${OUTPUT_DIRECTORY_NAME}`}
    ,
    (error, stdout, stderr)=>{handleChildProcessErros(error, stdout, stderr)}
    );
    
    


    console.log(`Merged ${filename1}.mp4 with ${filename2}.mp4 in ${outputVideoName}.mp4`);

    
}