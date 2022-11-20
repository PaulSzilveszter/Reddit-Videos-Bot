import * as https from 'https';
import * as fs from 'fs';
import * as child_process from 'child_process';

import { OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME, CHILD_PROCESS_DIR } from "../running_parameters.js";

import { handleChildProcessErros, deleteFile } from './ErrorHandlingModule.mjs';
import { checkAudioFile } from "./FfmpegModule.mjs"
import { writeToDatabase } from './DatabaseInitialization.mjs';

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

    const initializedDirectory = initializeOutputDirectory(OUTPUT_DIRECTORY_PATH) + "/" + filename;


    // const file = fs.createWriteStream(initializedDirectory);

    // const request = https.get(URL, function (response) {

    //     response.pipe(file);

    //     // after download completed close filestream
    //     file.on("finish", () => {
    //         file.close();
    //         console.log(`Downloaded ${filename}`);
    //     });
    // });

    //###################################

    child_process.execFileSync('curl', ['-o', filename, URL], {
        cwd: `${OUTPUT_DIRECTORY_PATH}/${OUTPUT_DIRECTORY_NAME}`,
        encoding: 'utf8',
        stdio: ['ignore', 'ignore', 'pipe']
    });

    //###############################################################################

    // const file = fs.appendFileSync(initializedDirectory);

    // const request = https.get(URL, function (response) {

    //     // response.pipe(file);

    //     console.log(response)

    //     // after download completed close filestream
    //     // file.on("finish", () => {
    //     //     file.close();
    //     //     console.log(`Downloaded ${filename}`);
    //     // });
    // });
}

export function downloadAudioAndVideoFiles(post, filename) {

    console.log("URL to the Video:\n", post.video_url, "\n");
    writeToDatabase(post.video_url, true);


    downloadFile(post.video_url, filename + ".mp4");
    downloadFile(post.audio_url, filename + ".mp3");


}

export function mergeAudioAndVideoFiles(post, filename) {

    // child_process.execSync(`ffmpeg -i ${filename}.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black" ${filename}1.mp4`
    //         ,
    //         {
    //             cwd: `${OUTPUT_DIRECTORY_PATH}/${OUTPUT_DIRECTORY_NAME}`,
    //             stdio: ['ignore', 'ignore', 'pipe']
    //         }
    
    //     );


    if (checkAudioFile(filename)) {
        // console.log("11111111111");
        child_process.execSync(`ffmpeg -i ${filename}.mp4 -i ${filename}.mp3 -c copy ${filename}_output.mp4`
            ,
            {
                cwd: `${OUTPUT_DIRECTORY_PATH}/${OUTPUT_DIRECTORY_NAME}`,
                stdio: ['ignore', 'ignore', 'pipe']
            }
            // ,
            // (error, stdout, stderr)=>{handleChildProcessErros(error, stdout, stderr)}
        );

    } else {
        // console.log("22222222222222222");

        child_process.execSync(`ffmpeg -i ${filename}.mp4 -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
    -c:v copy -shortest ${filename}_output.mp4`
            ,
            {
                cwd: `${OUTPUT_DIRECTORY_PATH}/${OUTPUT_DIRECTORY_NAME}`,
                stdio: ['ignore', 'ignore', 'ignore']
            }
        );
    }

    // deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + `${filename}1.mp4`);

    // await new Promise(r => setTimeout(r, 1000));

    // console.log("22222222222222222222222222222");
    // deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "temp_output.mp4");

    console.log(`Merged ${filename}`);





}

export function mergeTwoVideoFiles(filename1, filename2, outputVideoName) {
    child_process.execSync(`ffmpeg -i ${filename1}.mp4 -c copy intermediate1.ts
    ffmpeg -i ${filename2}.mp4 -c copy intermediate2.ts
    ffmpeg -i "concat:intermediate1.ts|intermediate2.ts" -c copy ${outputVideoName}.mp4`
        ,
        {
            cwd: `${OUTPUT_DIRECTORY_PATH}/${OUTPUT_DIRECTORY_NAME}`,
            stdio: ['ignore', 'ignore', 'ignore']
        }
        ,
        (error, stdout, stderr) => { handleChildProcessErros(error, stdout, stderr) }
    );




    console.log(`Merged ${filename1}.mp4 with ${filename2}.mp4 in ${outputVideoName}.mp4`);




}

export function deleteUnnecesaryFiles() {
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file0.mp4");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file0.mp3");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file0_output.mp4");

    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file1.mp4");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file1.mp3");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file1_output.mp4");

    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "intermediate1.ts");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "intermediate2.ts");

    console.log("Deleted unnecesary files!");
}

export function deleteUnnecesaryFiles2() {
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file0.mp4");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file0.mp3");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "file0_output.mp4");

    // deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "file1.mp4");
    // deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "file1.mp3");
    // deleteFile(OUTPUT_DIRECTORY_PATH + "/"+OUTPUT_DIRECTORY_NAME+"/"+ "file1_output.mp4");

    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "intermediate1.ts");
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" + "intermediate2.ts");

    console.log("Deleted unnecesary files!");
}