<template>
  <div id="v-monaco-editor"></div>
</template>

<script>
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { nextTick, onMounted } from "vue";

let editor;

const customLanguage = {
  // 定义关键词和操作符
  keywords: ["Add", "Subtract", "Multiply", "Divide"],
  operators: ["+", "-", "*", "/"],
  symbols: /[=><!~?:&|+\-*\/^%]+/,

  tokenizer: {
    root: [
      // 数字
      [/\d+/, "number"],

      // 函数名
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],

      // 操作符
      [/[{}()\[\]]/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": "",
          },
        },
      ],
    ],
  },
};

export default {
  components: {},
  setup(props) {
    const editorInit = () => {
      editor = monaco.editor.create(
        document.getElementById("v-monaco-editor"),
        {
          value: ``,
          language: "formulaLang",
          theme: "vs-dark",
          // minimap: {
          //   enabled: false,
          // },
        }
      );

      const customCompletionProvider = {
        // 提供自动补全项
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: "Add",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "Add(${1:num1}, ${2:num2})",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Add function",
              documentation: {
                value:
                  "The `Add` function takes two arguments and returns their sum.",
                isTrusted: true, // 确保文档内容被正确信任
              },
            },
            {
              label: "Subtract",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "Subtract(${1:num1}, ${2:num2})",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Subtract function",
              documentation: {
                value:
                  "The `Subtract` function takes two arguments and subtracts the second from the first.",
                isTrusted: true,
              },
            },
            {
              label: "Multiply",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "Multiply(${1:num1}, ${2:num2})",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Multiply function",
              documentation: {
                value:
                  "The `Multiply` function takes two arguments and returns their product.",
                isTrusted: true,
              },
            },
            {
              label: "Divide",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "Divide(${1:num1}, ${2:num2})",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Divide function",
              documentation: {
                value:
                  "The `Divide` function takes two arguments and returns the result of dividing the first by the second.",
                isTrusted: true,
              },
            },
          ];

          return { suggestions: suggestions };
        },
      };
      // 定义自定义的语法高亮规则
      monaco.languages.setMonarchTokensProvider("formulaLang", customLanguage);
      // 注册自动补全
      monaco.languages.registerCompletionItemProvider("formulaLang", {
        provideCompletionItems: (model, position) => {
          console.log("ceshi");
        },
      });

      //监听变化
      editor.onDidChangeModelContent((e) => {
        // console.log(e);
        // this.caretOffset = e.changes[0].rangeOffset; //获取光标位置
        // this.value = this.monacoEditor.getValue(); //使value和其值保持一致
      });
    };
    onMounted(() => {
      nextTick(() => {
        editorInit();
      });
    });
  },
};
</script>

<style scoped>
#v-monaco-editor {
  width: 100%;
  height: 100vh;
  text-align: left;
}
</style>
