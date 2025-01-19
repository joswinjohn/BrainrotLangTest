import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function BrainrotEditor() {
  const [code, setCode] = useState("// Write your brainrot code here");
  const [output, setOutput] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRunCode = () => {
    // This is a mock execution. In a real implementation,
    // you would send the code to a backend for execution.
    setOutput(
      `Executing code:\n\n${code}\n\nMock output: Hello from brainrot lang!`
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
                defaultLanguage="javascript" // You can create a custom language for brainrot if needed
                defaultValue={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 24 }, // Add padding to the top
                }}
                className="rounded-lg" // Add rounded corners to the editor
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
