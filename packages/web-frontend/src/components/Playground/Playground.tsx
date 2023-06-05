import { useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { createParser } from "js-parser";

const codeMirrorJsExtensions = [javascript({ jsx: true })];
const codeMirrorJSONExtensions = [json()];

export function Playground() {
  const [code, setCode] = useState<string>("");
  const [astJson, setAstJson]= useState<string>("");
  const onJsCodeMirrorChange = useCallback((code: string) => {
    setCode(code);
  }, []);
  const transformCode = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        setAstJson(JSON.stringify(createParser(code).parse(), null, 4));
    } catch(e) {
        console.log(e);
    }
  }
  return (
    <div className="bg-slate-950 mt-6" id="playground">
        <div className="hidden lg:block">
            <h2 className="ext-2xl font-bold tracking-tight text-slate-50 text-4xl text-center"> 
                Write JavaScript Into Left Section 
            </h2>
            <div className="mx-auto flex max-w-screen-lg items-center gap-x-12 p-8">
                <CodeMirror
                    className="flex-1 overflow-auto"
                    theme={androidstudio}
                    value={code}
                    height="500px"
                    extensions={codeMirrorJsExtensions}
                    onChange={onJsCodeMirrorChange}
                />
                <CodeMirror
                    className="flex-1 overflow-auto"
                    theme={androidstudio}
                    value={astJson}
                    height="500px"
                    extensions={codeMirrorJSONExtensions}
                />
            </div>
            <div className=" p-6 mx-auto flex justify-center">
                <button 
                    role="button"
                    className="  z-50 cursor-pointer rounded-md bg-indigo-600 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={transformCode}
                >
                    Transform
                </button>
            </div>
        </div>
        <div className="lg:hidden mx-auto max-w-screen-lg px-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl text-center  mb-6"> 
                Write JavaScript Into Frist Section 
            </h2>
            <CodeMirror
                className="flex-1 mb-4"
                theme={androidstudio}
                value="console.log('hello world!');"
                height="250px"
                extensions={codeMirrorJsExtensions}
                onChange={onJsCodeMirrorChange}
            />
            <CodeMirror
                className="flex-1 mb-4"
                theme={androidstudio}
                value={'{ "kind:: 123, "body": [] }'}
                height="250px"
                extensions={codeMirrorJSONExtensions}
            />
            <div className=" p-2 mx-auto flex justify-center">
                <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Transform
                </button>
            </div>
        </div>
    </div>
  )
}
