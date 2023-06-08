/* eslint-env node */
import path from "path";
import { readdir } from "fs/promises";
import { createParser } from "@/src/parser";

const regx = new RegExp('.*.js');

async function recursivelyAddTestCase(dirPath: string, casesPath: Array<string>) {
    const files = await readdir(dirPath);
    const subDir: Array<Promise<void>> = [];
    files.forEach(file => {
        if(regx.test(file)) {
            casesPath.push(path.join(dirPath, file));
            return;
        }
        subDir.push(recursivelyAddTestCase(path.join(dirPath, file), casesPath));
    });
    await Promise.all(subDir);
}

async function findAllTestCase() {
    const casesRoot = path.join(__dirname, "cases");
    const fixtureRoot = path.join(__dirname, "fixtures");
    const testCasesPaths: Array<string> = []
    await Promise.all(
        [
            recursivelyAddTestCase(casesRoot, testCasesPaths),
            recursivelyAddTestCase(fixtureRoot, testCasesPaths),
        ]
    )
    console.log(testCasesPaths);
}


findAllTestCase().catch(e => console.log(e));
