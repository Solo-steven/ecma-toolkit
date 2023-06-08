/* eslint-env node  */
import path from 'path';
import rollupTypeScript from "@rollup/plugin-typescript";
import rollupDts from "rollup-plugin-dts";

/** @type {import('rollup').RollupOptions} */
const Config = [
    {
        input: "./src/index.ts",
        output: {
            dir: path.join(__dirname, "dist"),
            format: "cjs",
        },
        plugins:  [
            rollupTypeScript({
                tsconfig: path.join(__dirname, "tsconfig.build.json")
            }),
        ]
    },
    {
        input: "./src/index.ts",
        output: {
            dir: path.join(__dirname, "dist"),
            format: "esm",
        },
        plugins:  [
            rollupTypeScript({
                tsconfig: path.join(__dirname, "tsconfig.build.json")
            }),
            // see issue https://github.com/Swatinem/rollup-plugin-dts/issues/247
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            rollupDts.default(),
        ]
    }
]

export default Config;