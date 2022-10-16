import * as child_process from 'child_process';

import { OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME, CHILD_PROCESS_DIR } from "../running_parameters.js";

import { handleChildProcessErros } from "./ErrorHandlingModule.mjs"

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

    const REGEXP = /Duration: N\/A, bitrate: N\/A/

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


