import { useEffect, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import Sandbox from "@nyariv/sandboxjs";
import { aliases } from "./aliases";
import { brainrotLang } from "./editor-config";

// Register the custom language configuration
loader.init().then((monaco) => {
  monaco.languages.register({ id: brainrotLang.id });
  monaco.languages.setMonarchTokensProvider(
    brainrotLang.id,
    brainrotLang.loader().language
  );
  monaco.languages.setLanguageConfiguration(
    brainrotLang.id,
    brainrotLang.loader().conf
  );
});

export default function BrainrotEditor() {
  const [code, setCode] = useState("// Loading example code...");
  const [output, setOutput] = useState("");
  const [execTime, setExecTime] = useState<null | number>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Fetch the example code from the example.txt file
  useEffect(() => {
    fetch("/src/exampleCode.txt")
      .then((response) => response.text())
      .then((text) => setCode(text))
      .catch((error) => console.error("Error loading example code:", error));
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRunCode = () => {
    // Replace aliases in the code with their corresponding values
    let codeWithAliases = code;
    for (const [alias, value] of Object.entries(aliases)) {
      codeWithAliases = codeWithAliases.replace(new RegExp(alias, "g"), value);
    }

    // Overwrite console.log so we can capture the output rather than logging to the console
    let logOutput = "";
    const scope = {
      yap: (...args: any[]) => {
        logOutput += args.join(" ") + "\n";
      },
    };

    const sandbox = new Sandbox();
    let execTime = 0;
    try {
      const startTime = performance.now();
      const exec = sandbox.compile(codeWithAliases);
      const result = exec(scope).run();
      execTime = performance.now() - startTime;

      // Parse the output. If the result is not undefined (i.e. the code has a return value),
      // append the result to the log output from console.log
      let parsedOutput = logOutput;
      if (result !== undefined) {
        parsedOutput += String(result);
      }
      setOutput(parsedOutput);
    } catch (error: any) {
      setOutput(error.toString());
    }

    // Set the code execution time
    setExecTime(execTime);
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-8">
      <div
        className={`col-span-9 flex flex-col ${
          showTutorial ? "" : "col-start-2 col-span-10"
        }`}
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        <h1 className="pb-2 text-3xl font-bold text-center text-gray-800">
          Brainrot Lang
        </h1>
        <div className="flex flex-col flex-grow space-y-4 bg-white shadow-lg rounded-lg p-6">
          <div className="overflow-hidden rounded-lg">
            <Editor
              language={brainrotLang.id}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 24 },
              }}
              className="h-96"
            />
          </div>
          <div className="flex justify-between items-center space-x-2">
            <button
              onClick={handleRunCode}
              className="w-full bg-gray-800 rounded-lg text-md font-semibold text-white py-2"
            >
              Run Code
            </button>
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="py-2 px-6 rounded-lg text-md font-semibold text-gray-800 border border-gray-800 hover:text-white hover:bg-gray-800"
            >
              Tutorial
            </button>
          </div>
          <div className="flex-grow bg-gray-800 text-white p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-2">Output:</h2>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {output || "Code execution output will appear here."}
              <br />
              {execTime ? (
                <span className="text-gray-400">
                  Executed in {execTime?.toFixed(2)}ms
                </span>
              ) : null}
            </pre>
          </div>
        </div>
      </div>
      <div
        className={`col-span-3 sticky top-12 overflow-auto shadow-lg rounded-lg text-gray-800 ${
          showTutorial ? "block" : "hidden"
        }`}
        style={{ height: "calc(100vh - 5rem)" }}
      >
        <button
          onClick={() => setShowTutorial(false)}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold pt-6 text-black text-center">
          Tutorial
        </h1>
        <div className="px-6 pt-3">
          <p className="text-md mb-4">
            Welcome to Brainrot Lang! This is a simple programming language
            based on JavaScript that uses brainrot terms instead of JavaScript
            keywords.
            <br />
            <br />
            Use the keywords listed below in place of their JavaScript
            equialents to write code in brainrot.
          </p>
        </div>
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold text-black mb-2">Keywords:</h2>
          <ul className="text-md list-disc px-6">
            {Object.entries(aliases).map(([alias, value]) => (
              <li key={alias}>
                <code>
                  <span className="font-semibold">{alias}</span> - {value}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
