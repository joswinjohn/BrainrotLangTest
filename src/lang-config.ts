// Configuration for the Brainrot language in the Monaco Editor
import { languages } from "monaco-editor";

type IMonarchLanguageRule = languages.IMonarchLanguageRule;

export const brainrotLang = {
  id: "brainrot",
  extensions: [".br"],
  aliases: ["Brainrot", "brainrot"],
  loader: () => {
    return {
      conf: {
        comments: {
          lineComment: "//",
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ] as languages.CharacterPair[],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      },
      language: {
        defaultToken: "",
        tokenPostfix: ".br",
        keywords: [
          "womp womp",
          "opp",
          "glaze",
          "jelq",
          "ohio",
          "cap",
          "sigma",
          "fanum tax",
          "diddy",
          "edge",
          "mew",
          "beta",
          "shyt",
          "hawk tuah",
          "aura",
          "looksmaxx",
          "alpha",
          "gyatt",
        ],
        operators: ["=", ">", "<", "!", "==", "!=", "===", "!==", "+", "-", "*", "/", "%"],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, { cases: { "@keywords": "keyword" } }],
            { include: "@whitespace" },
            [/[{}()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
            [/\d+/, "number"],
            [/[;,.]/, "delimiter"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          ] as IMonarchLanguageRule[],
          whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\/.*$/, "comment"],
          ] as IMonarchLanguageRule[],
          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape.invalid"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ] as IMonarchLanguageRule[],
        },
      },
    };
  },
};