import { useEffect, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import Sandbox from "@nyariv/sandboxjs";
import { aliases } from "./aliases";
import { brainrotLang } from "./lang-config";

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

    // Append the execution time to the output
    setOutput(
      (prevOutput) => prevOutput + `\n\nExecuted in ${execTime.toFixed(2)}ms`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Brainrot Lang Editor
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
              <Editor
                height="300px"
                language={brainrotLang.id}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 24 },
                }}
                className="rounded-lg"
              />
            </div>
            <button
              onClick={handleRunCode}
              className="w-full bg-gray-800 rounded-lg mb-4 text-md font-semibold text-white py-2"
            >
              Run Code
            </button>
            <div className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700">
              <h2 className="text-lg font-semibold mb-2">Output:</h2>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {output || "Code execution output will appear here."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
