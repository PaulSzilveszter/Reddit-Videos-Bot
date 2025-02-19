import * as child_process from 'child_process';

import { OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME, CHILD_PROCESS_DIR } from "../running_parameters.js";

import { deleteFile, handleChildProcessErros } from "./ErrorHandlingModule.mjs"

export  function getVideoDuration(filename) {

    let outputData;

    let ls = child_process.spawnSync(`ffprobe`, [`-i`, `${filename}`, `-v`, `quiet`, `-show_entries`, `format=duration`, `-hide_banner`, `-of`, `default=noprint_wrappers=1:nokey=1`/*, `-sexagesimal`*/
    ],
        CHILD_PROCESS_DIR
    );

    const {stdout} =  ls;
    outputData = stdout.toString();

    return Number(outputData);
    
}

export function checkAudioFile(filename){
    let ls = child_process.spawnSync(`ffprobe`, [`-i`, `${filename}.mp3`
    ],
        CHILD_PROCESS_DIR
    );

    let{stdout, stderr} = ls;
    stdout = stdout.toString();
    stderr = stderr.toString()//.split("\n");
    let k = stderr;
    //  k  = stderr[stderr.length-2].split(" ")[2];

    // console.log(k+"\n####################")

    const REGEXP = /(Duration: N\/A, bitrate: N\/A)|(file0.mp3: Invalid argument)|(file1.mp3: Invalid argument)/

    const TESTED = REGEXP.test(k)

    console.log(TESTED);

    if(TESTED  == true){
        console.log("The audio file is INVALID...");
        return false;
    }
    else{
        console.log("The audio file is VALID...");
        return true;
    }
}

export function changeAspectRatio(aspectRatio, filename){
    child_process.execSync(`ffmpeg -i ${filename}.mp4 -vf "scale=${aspectRatio}:force_original_aspect_ratio=decrease,pad=${aspectRatio}:-1:-1:color=black" FINAL_OUTPUT.mp4`
            ,
            {
                cwd: `${OUTPUT_DIRECTORY_PATH}/${OUTPUT_DIRECTORY_NAME}`,
                stdio: ['ignore', 'ignore', 'pipe']
            }
    
        );
    deleteFile(OUTPUT_DIRECTORY_PATH + "/" + OUTPUT_DIRECTORY_NAME + "/" +  `${filename}.mp4`);
        //EX ASPECT RATIO "1280:720"
}


