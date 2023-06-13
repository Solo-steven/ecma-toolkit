/* eslint-env node */
import path from "path";
import { readdir, stat, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { createParser } from "@/src/parser";
import { transformSyntaxKindToLiteral } from "./transform";
/**
 *  Env Variable
 */
const isUpdate = Boolean(process.env.TEST_UPDATE) || false;
const gate = Number(process.env.TEST_GATE) || 1;
// eslint-disable-next-line no-useless-escape
const jsFileRegex = new RegExp('.*\.js$');
// eslint-disable-next-line no-useless-escape
const jsonFileRegex = new RegExp('.*\.json$');
const invalidFileReg = new RegExp('invalid');
/**
 * Test structure for test case.
 * @property {string} jsPath  absolute path for js file in current os file system
 * @property {string} jsonPath absolute path for json file in current os file system
 * @property {string} fileName part of file path start with /cases/ and /fixtures/ dir
 */
interface TestCase {
    jsPath: string;
    jsonPath: string;
    fileName: string;
}
/**
 * Helper function for `findAllTestCase`, using recurion to find all test case 
 * under given root dir.
 * @param {string} dirPath 
 * @param {string} prefixFileName 
 * @param {string} casesPath 
 * @param {string} shouldNotExistPath 
 */
async function recursivelyAddTestCase(dirPath: string, prefixFileName: string, casesPath: Array<TestCase>, shouldNotExistPath: Array<string>){
    const filesPaths = await readdir(dirPath);
    const subDir: Array<Promise<void>> = [];
    for(const filePath of filesPaths) {
        const isDir = (await stat(path.join(dirPath, filePath))).isDirectory();
        if(isDir) {
            subDir.push(recursivelyAddTestCase(path.join(dirPath, filePath), path.join(prefixFileName, filePath), casesPath, shouldNotExistPath));
            continue;
        }
        if(jsFileRegex.test(filePath)) {
            const fileName = filePath.split(".")[0];
            casesPath.push({
                jsPath: path.join(dirPath, filePath),
                jsonPath: existsSync(path.join(dirPath, `${fileName}.json`)) ? path.join(dirPath,`${fileName}.json`) : "",
                fileName: path.join(prefixFileName, filePath)
            })
        }
        if(jsonFileRegex.test(filePath)) {
            continue;
        }
        shouldNotExistPath.push(filePath);
    }
    await Promise.all(subDir);
}
/**
 * Main function for find all test case under `cases` and 
 * `fixtures` folder, using `recursivelyAddTestCase ` as 
 * helper function
 * @returns 
 */
async function findAllTestCase(): Promise<Array<TestCase>> {
    const casesRoot = path.join(__dirname, "cases");
    const fixtureRoot = path.join(__dirname, "fixtures");
    const testCasesPaths: Array<TestCase> = []
    const shouldNotExistedFilePath: Array<string> = [];
    await Promise.all(
        [
            recursivelyAddTestCase(casesRoot, "cases", testCasesPaths, shouldNotExistedFilePath),
            recursivelyAddTestCase(fixtureRoot, "fixtures", testCasesPaths, shouldNotExistedFilePath),
        ]
    )
   return testCasesPaths;
}
/**
 *  Result structure of every test case, 
 *  @property {string} fileName, is file path start with cases` and `fixture` folder.
 *  @property {string} result is used when failed.
 */
interface Result {
    fileName: string;
    result: string;
}
const failedTestCases: Array<Result> = [];
const skipTestCases: Array<Result> = [];
const passTestCases: Array<Result> = [];
const updateTestCases: Array<Result> = [];
/**
 * Helper function that parse code string and
 * transform to more readable ast format string
 * @param {string} code 
 * @returns {string} 
 */
function toASTString(code: string): string {
    const ast = createParser(code.toString()).parse();
    transformSyntaxKindToLiteral(ast);
    return JSON.stringify(ast, null, 4);
}
/**
 * Helper function for running a test case if js path and json path all are exsited.
 * if test case pass, add to pass array.
 * if test failed, add to failed array.
 * @param {TestCase} testCase 
 */
async function runTestCase(testCase: TestCase) {
    if(!testCase.fileName || !testCase.jsPath || !testCase.jsonPath) {
        throw new Error(`[Internal Error]: Something wrong happend in test runner.Please report to github`);
    }
    const [code, expectAST] = await Promise.all([
        readFile(testCase.jsPath),
        readFile(testCase.jsonPath),
    ]);
    try {
        const codeString = code.toString();
        const astString = toASTString(codeString);
        const expectASTString = expectAST.toString();
        if(astString === expectASTString) {
            passTestCases.push({
                fileName: testCase.fileName,
                result: "",
            });
        }else {
            failedTestCases.push({
                fileName: testCase.fileName,
                result: "{ Diff Error }",
            });
        }
    } catch(e) {
        failedTestCases.push({
            fileName: testCase.fileName,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            result: `{ Compiler Error }: ${e?.toString()} `
        })
    }
}
/**
 *  Helperfunction for running a test case that should be 
 *  invalid.
 *  if it throw a parse error, add to pass arrray
 *  if it shows no error, add to failed array.
 *  @param {TestCase} testCase
 */
async function runInvalidTestCase(testCase: TestCase) {
    try {
        const code = await readFile(testCase.jsPath);
        toASTString(code.toString());
        failedTestCases.push({
            fileName: testCase.fileName,
            result: "This case should failed",
        })
    } catch(e) {
        passTestCases.push({
            fileName: testCase.fileName,
            result: ``
        })
    }
}
/**
 * Helper function for runnung a test case and update json file
 * if update success, add to update array
 * if failed, add to failed array.
 * @param {TestCase} testCase 
 */
async function updateTestCase(testCase: TestCase) {
    let isExisted = true;
    if(!testCase.jsonPath) {
        isExisted = false
        testCase.jsonPath = testCase.jsPath.split(".")[0] + ".json";
    }
    try {
        const code = await readFile(testCase.jsPath);
        const astString = toASTString(code.toString());
        await writeFile(testCase.jsonPath, astString, { flag: isExisted ? "w" : "wx" });
        updateTestCases.push({
            fileName: testCase.fileName,
            result: "",
        })
    } catch(e) {
        failedTestCases.push({
            fileName: testCase.fileName,
            result: `{ Compiler Error When Update Case }`
        })
    }
}
async function runerAllTestCase() {
    const testCases = await findAllTestCase();
    await Promise.all(testCases.map((testCase) => {
        if(invalidFileReg.test(testCase.fileName)) {
            return runInvalidTestCase(testCase);
        }
        if(isUpdate) {
            return updateTestCase(testCase);
        }
        // pass test case.
        if(!testCase.jsonPath && !isUpdate) {
            skipTestCases.push({
                fileName: testCase.fileName,
                result: `Skip because ${testCase.fileName} does not has corresponse json file.`
            })
            return;
        }
        // run test case
        if(testCase.fileName && testCase.jsPath && testCase.fileName) {
            return runTestCase(testCase);
        }
    }));
}

function report() {
    for(const testCase of passTestCases) {
        console.log((`|PASS|: ${testCase.fileName}`));
    }
    for(const testCase of skipTestCases) {
        console.log((`|Skip|: ${testCase.fileName}`))
    }
    for(const testCase of updateTestCases) {
        console.log((`|Update|: ${testCase.fileName}`));
    }
    for(const testCase of failedTestCases) {
        console.log((`|Failed|: ${testCase.fileName}`));
        console.log((`  |----> ${testCase.result}`));
    }
    const allTestCaseCount = failedTestCases.length + skipTestCases.length + passTestCases.length + updateTestCases.length;
    const passRate = passTestCases.length / allTestCaseCount;
    const failedRate = failedTestCases.length / allTestCaseCount;
    const updateRate = updateTestCases.length / allTestCaseCount;
    console.log("\n==========================================================\n");
    console.log(`Pass rate:  ${passRate}`);
    console.log(`Update rate: ${updateRate}`);
    console.log(`Failed rate : ${failedRate}`);
    if(passRate < gate - updateRate) {
        process.exit(1);
    }else {
        process.exit(0);
    }
}
/**
 * Script Entry point
 */
runerAllTestCase()
    .then(() => {
        report();
    })
    .catch(console.log);