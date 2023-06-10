/* eslint-env node */
import path from "path";
import { readdir, stat, readFile } from "fs/promises";
import { existsSync } from "fs";
import { createParser } from "@/src/parser";

// eslint-disable-next-line no-useless-escape
const jsFileRegex = new RegExp('.*\.js$');
// eslint-disable-next-line no-useless-escape
const jsonFileRegex = new RegExp('.*\.json$');
interface TestCase {
    jsPath: string;
    jsonPath: string;
}

async function recursivelyAddTestCase(dirPath: string, casesPath: Array<TestCase>, shouldNotExistPath: Array<string>){
    const filesPaths = await readdir(dirPath);
    const subDir: Array<Promise<void>> = [];
    for(const filePath of filesPaths) {
        const isDir = (await stat(path.join(dirPath, filePath))).isDirectory();
        if(isDir) {
            subDir.push(recursivelyAddTestCase(path.join(dirPath, filePath), casesPath, shouldNotExistPath));
            continue;
        }
        if(jsFileRegex.test(filePath)) {
            const fileName = filePath.split(".")[0];
            casesPath.push({
                jsPath: path.join(dirPath, filePath),
                jsonPath: existsSync(path.join(dirPath, `${fileName}.json`)) ? path.join(dirPath,`${fileName}.json`) : ""
            })
        }
        if(jsonFileRegex.test(filePath)) {
            continue;
        }
        shouldNotExistPath.push(filePath);
    }
    await Promise.all(subDir);
}

async function findAllTestCase(): Promise<Array<TestCase>> {
    const casesRoot = path.join(__dirname, "cases");
    const fixtureRoot = path.join(__dirname, "fixtures");
    const testCasesPaths: Array<TestCase> = []
    const shouldNotExistedFilePath: Array<string> = [];
    await Promise.all(
        [
            recursivelyAddTestCase(casesRoot, testCasesPaths, shouldNotExistedFilePath),
            recursivelyAddTestCase(fixtureRoot, testCasesPaths, shouldNotExistedFilePath),
        ]
    )
   return testCasesPaths;
}

async function runerAllTest() {
    const failedTestCase = [];
    const testCases = await findAllTestCase();
    const promise =  testCases.map( async (testCase) => {
        if(!testCase.jsonPath) {
            return;
        }
        const [code, expectAST] = await Promise.all([
            readFile(testCase.jsPath),
            readFile(testCase.jsonPath),
        ])
        const ast = createParser(code.toString()).parse();
        const astString = JSON.stringify(ast, null, 4);
        if(astString === expectAST.toString()) {
            console.log("Done", testCase.jsPath)
        }
    })
    await Promise.all(promise);

}


runerAllTest().catch(console.log);