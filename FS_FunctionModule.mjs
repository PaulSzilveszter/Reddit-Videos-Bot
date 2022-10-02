// import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';

function initializeDirectory(filepath) {
    const FINAL_PATH = filepath + "/Assets";
    
    const exists = fs.existsSync(FINAL_PATH);
    if (exists === true) {

        return FINAL_PATH;

    }
    fs.mkdirSync(FINAL_PATH);

    return FINAL_PATH;
}

export function downloadFile(URL, filename) {

    const INIT_DIR = initializeDirectory(".")+"/"+filename;
    console.log(INIT_DIR);

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