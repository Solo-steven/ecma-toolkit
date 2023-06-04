/* eslint-env node  */
import path from 'path';
import rollupTypeScript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const Config ={
    input: "./src/index.ts",
    output: {
        dir: path.join(__dirname, "dist"),
        format: "cjs",
    },
    plugins:  [
        rollupTypeScript({
            tsconfig: path.join(__dirname, "tsconfig.build.json")
        })
    ]
}

export default Config;