import * as fs from 'fs';

export const  handleChildProcessErros =(error, stdout, stderr)=> {
    // console.log('stdout: ' + stdout);
    // console.log('stderr: ' + stderr);
    if (error !== null) {
         console.log('exec error: ' + error);
    }
}
export function deleteFile(filenpath){
    fs.unlink(filenpath, (err) => {
        if (err) throw err;
        console.log(`${filenpath} was deleted!`);
      });
}
