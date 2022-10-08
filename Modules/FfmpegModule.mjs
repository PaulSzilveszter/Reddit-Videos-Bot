import * as child_process from 'child_process';
import { lstat } from 'fs';

import { OUTPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_NAME, CHILD_PROCESS_DIR } from "../running_parameters.js";

import { handleChildProcessErros } from "./ErrorHandlingModule.mjs"

export async function getVideoDuration(filename) {

    let outputData;

    let ls = child_process.spawn(`ffprobe`, [`-i`, `${filename}`, `-v`, `quiet`, `-show_entries`, `format=duration`, `-hide_banner`, `-of`, `default=noprint_wrappers=1:nokey=1`/*, `-sexagesimal`*/
    ],
        CHILD_PROCESS_DIR
    );

    // ls.stdout.on('data', (data) => {
    //     console.log(`Video length: ${data.toString()}`);
    //     outputData = data.toString();
    //     console.log(outputData);
    // });

    // ls.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });


    // ls.on('close', (code) => {
    //     console.log(`child process exited with code ${code}`);
    // });

    const {stdout} = await ls;
    outputData = await stdout.on('data', (data) => {
            console.log(`Video length formated: ${data.toString()}`);
            outputData = data.toString();
            // console.log(outputData);
    })

    await new Promise(r => setTimeout(r, 2000));

    return outputData;
    

   

    
    

    // outputData = outputData.split(/\.|\:/);

    // console.log(outputData);
    

}
