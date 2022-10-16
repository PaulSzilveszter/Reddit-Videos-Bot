import fetch from "node-fetch";
import * as https from 'https';
import * as fs from 'fs';
import * as child_process from 'child_process';

import { DATABASE } from "../running_parameters.js";

export function databaseInitialization() {

    fs.readFile("./database/database.txt", function (err, buf) {
        if (err) { console.log(err) }

        // console.log(buf.toString());
        buf = buf.toString();
        buf = buf.split("\n");
        for (let i = 0; i < buf.length; i++) {
            DATABASE.set(buf[i], true);
        }
    });
    fs.readFile("./database/banned_videos.txt", function (err, buf) {
        if (err) { console.log(err) }

        // console.log(buf.toString());
        buf = buf.toString();
        buf = buf.split("\n");
        for (let i = 0; i < buf.length; i++) {
            DATABASE.set(buf[i], true);
        }
    });


}
export function writeToDatabase(key, value) {
    DATABASE.set(key, value);
}
export function updateDatabase() {
    let newDatabase = ""

    for (const [key] of DATABASE) {
        newDatabase += key + "\n";
    }

    console.log(newDatabase);

    fs.writeFile("./database/database.txt", newDatabase, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to the Database.");
      });
}