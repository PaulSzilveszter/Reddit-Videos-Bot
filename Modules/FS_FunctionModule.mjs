// import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';
import * as child_process from 'child_process';

const filepath=".";

function initializeDirectory() {
    const FINAL_PATH = filepath + "/Assets";
    
    const exists = fs.existsSync(FINAL_PATH);
    if (exists === true) {

        return FINAL_PATH;

    }
    fs.mkdirSync(FINAL_PATH);

    return FINAL_PATH;
}

export function downloadFile(URL, filename) {

    const INIT_DIR = initializeDirectory()+"/"+filename;
    // console.log(INIT_DIR);

    const file = fs.createWriteStream(INIT_DIR);



    const request = https.get(URL, function (response) {

        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
        });
    });
}



export function downloadFiles(post, filename){
    downloadFile(post.video_url, filename+".mp4");
    downloadFile(post.audio_url,  filename+".mp3");
    
    
}
export function mergeFiles(post, filename){
    child_process.exec(`ffmpeg -i ${filename}.mp4 -i ${filename}.mp3 -c copy ${filename}_output.mp4

    `
    
    ,
    {cwd: "./Assets"}
    ,function (error, stdout, stderr) {
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });
}