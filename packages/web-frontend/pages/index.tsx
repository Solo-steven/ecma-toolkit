import { useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";

const codeMirrorJsExtensions = [javascript({ jsx: true })];
const codeMirrorJSONExtensions = [json()];

export default function Home() {
  const [code, setCode] = useState<string>("");
  const onJsCodeMirrorChange = useCallback((code: string) => {
    setCode(code);
  }, []);
  return (
    <div>
        <CodeMirror
          theme={androidstudio}
          value="console.log('hello world!');"
          height="200px"
          extensions={codeMirrorJsExtensions}
          onChange={onJsCodeMirrorChange}
        />
        <CodeMirror
          theme={androidstudio}
          value={'{ "kind:: 123, "body": [] }'}
          height="200px"
          extensions={codeMirrorJSONExtensions}
        />
    </div>
  )
}
