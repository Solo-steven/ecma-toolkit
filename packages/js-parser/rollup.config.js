import path from 'path';
import rollupTypeScript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const Config ={
    input: "./src/index.ts",
    output: {
        file: "parser.cjs",
        format: "cjs",
    },
    plugins:  [
        rollupTypeScript()
    ]
}

export default Config;