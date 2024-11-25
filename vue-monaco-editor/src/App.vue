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
export default {
  components: {},
  setup(props) {
    const editorInit = () => {
      editor = monaco.editor.create(
        document.getElementById("v-monaco-editor"),
        {
          value: ``,
          language: "javascript",
          theme: "vs-dark",
          minimap: {
            enabled: false,
          },
        }
      );
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
}
</style>
