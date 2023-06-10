import { useState, useCallback, Fragment } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Dialog, Transition } from "@headlessui/react";
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { createParser, transformSyntaxKindToLiteral } from "js-compiler";

const codeMirrorJsExtensions = [javascript({ jsx: true })];
const codeMirrorJSONExtensions = [json()];

export function Playground() {
  const [code, setCode] = useState<string>("");
  const [astJson, setAstJson]= useState<string>("");
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const onJsCodeMirrorChange = useCallback((code: string) => {
    setCode(code);
  }, []);
  const transformCode = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const ast = createParser(code).parse();
        transformSyntaxKindToLiteral(ast);
        setAstJson(JSON.stringify(ast, null, 4));
    } catch(e: any) {
        setOpenModal(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        setErrorMsg(e.toString() as string);

    }
  }
  return (
    <div className="relative bg-slate-950 mt-6" id="playground">
        <div className="hidden lg:block">
            <h2 className="ext-2xl font-bold tracking-tight text-slate-50 text-4xl text-center"> 
                Write JavaScript Into Left Section 
            </h2>
            <div className="mx-auto flex max-w-screen-lg items-center gap-x-12 p-8 relative z-50">
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
        <div className=" z-50 lg:hidden mx-auto max-w-screen-lg px-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl text-center  mb-6"> 
                Write JavaScript Into Frist Section 
            </h2>
            <div className="relative z-50">
            <CodeMirror
                className="flex-1 mb-4"
                theme={androidstudio}
                value={code}
                height="250px"
                extensions={codeMirrorJsExtensions}
                onChange={onJsCodeMirrorChange}
            />
            <CodeMirror
                className="flex-1 mb-4"
                theme={androidstudio}
                value={astJson}
                height="250px"
                extensions={codeMirrorJSONExtensions}
            />
            </div>
            <div className=" p-2 mx-auto flex justify-center">
                <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Transform
                </button>
            </div>
        </div>
        <Transition appear show={isOpenModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setOpenModal(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Some Parser Error Happend
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            {JSON.stringify(errorMsg)}
                        </p>
                    </div>

                    <div className="mt-4">
                        <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setOpenModal(false)}
                        >
                        Close
                        </button>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    </div>
  )
}
