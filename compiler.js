/*
..######...#######..##.....##.########..####.##.......########.########.
.##....##.##.....##.###...###.##.....##..##..##.......##.......##.....##
.##.......##.....##.####.####.##.....##..##..##.......##.......##.....##
.##.......##.....##.##.###.##.########...##..##.......######...########.
.##.......##.....##.##.....##.##.........##..##.......##.......##...##..
.##....##.##.....##.##.....##.##.........##..##.......##.......##....##.
..######...#######..##.....##.##........####.########.########.##.....##
*/
/**
 * 将 let x = 10 + 20 转为  var x = 10 + 20
 * 1. tokenizer
 * 2. parser
 * ---需不需要有语法转换
 * 3. code generator
 */

const TOKEN_TYPES = {
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  OPERATOR: "OPERATOR",
};

function tokenizer(input) {
  // 一个一个的去读字符
  // 指针
  let current = 0;
  const codeLen = input.length;
  //   分词
  const tokens = [];

  while (current < codeLen) {
    const char = input[current];
    console.log(char);
    // 去除空格
    if (char === " ") {
      current++;
      continue;
    }
    // 看是不是 let
    if (char === "l" && input.slice(current, current + 3) === "let") {
      tokens.push({
        type: TOKEN_TYPES.KEYWORD,
        value: "let",
      });
      current += 3;
      continue;
    }
    // 看是不是变量
    if (/[a-zA-Z]/.test(char)) {
      let identifier = "";
      //   贪婪匹配，一直完后找找到不符合的为止
      while (/[a-zA-Z0-9]/.test(input[current])) {
        identifier += input[current];
        current++;
      }
      tokens.push({
        type: TOKEN_TYPES.IDENTIFIER,
        value: identifier,
      });
    }
    // 操作符
    if (/[=+\-*]/.test(char)) {
      tokens.push({
        type: TOKEN_TYPES.OPERATOR,
        value: char,
      });
    }
    // 数字
    if (/[0-9]/.test(char)) {
      let number = "";
      while (/[0-9]/.test(input[current])) {
        number += input[current];
        current++;
      }
      tokens.push({
        type: TOKEN_TYPES.NUMBER,
        value: number,
      });
    }
    // 识别关键字
    current++;
  }
  return tokens;
}

const code = "let x = 10 + 20";

const tokens = tokenizer(code);
console.log("🚀 ~ tokens:", tokens);

const AST_NODE_TYPES = {
  VARIABLE_DECLARATION: "VariableDeclaration",
  BINARY_EXPRESSION: "BinaryExpression",
  IDENTIFIER: "Identifier",
  LITERAL: "Literal",
};

// 语法分析器
function parser(tokens) {
  let i = 0;

  function parseVariableDeclaration() {
    const token = tokens[i];
    if (token.type === TOKEN_TYPES.KEYWORD && token.value === "let") {
      i++;
      const identifier = tokens[i];
      i++;
      const operator = tokens[i];
      i++;
      const expression = parseExpression();
      return {
        type: AST_NODE_TYPES.VARIABLE_DECLARATION,
        identifier: { type: AST_NODE_TYPES.IDENTIFIER, name: identifier.value },
        init: expression,
      };
    }
  }

  function parseExpression() {
    let left = parsePrimary();

    while (i < tokens.length && tokens[i].type === TOKEN_TYPES.OPERATOR) {
      const operator = tokens[i].value;
      i++;
      const right = parsePrimary();
      left = {
        type: AST_NODE_TYPES.BINARY_EXPRESSION,
        operator,
        left,
        right,
      };
    }

    return left;
  }

  function parsePrimary() {
    const token = tokens[i];
    if (token.type === TOKEN_TYPES.NUMBER) {
      i++;
      return { type: AST_NODE_TYPES.LITERAL, value: Number(token.value) };
    }
    if (token.type === TOKEN_TYPES.IDENTIFIER) {
      i++;
      return { type: AST_NODE_TYPES.IDENTIFIER, name: token.value };
    }
  }

  return parseVariableDeclaration();
}

const ast = parser(tokens);
console.log('🚀 ~ ast:', ast)

function codeGeneration(node) {
    switch (node.type) {
      case AST_NODE_TYPES.VARIABLE_DECLARATION:
        return (
          'var ' +
          codeGeneration(node.identifier) +
          ' = ' +
          codeGeneration(node.init) +
          ';'
        );
      case AST_NODE_TYPES.BINARY_EXPRESSION:
        return (
          codeGeneration(node.left) +
          ' ' +
          node.operator +
          ' ' +
          codeGeneration(node.right)
        );
      case AST_NODE_TYPES.LITERAL:
        return node.value.toString();
      case AST_NODE_TYPES.IDENTIFIER:
        return node.name;
      default:
        throw new Error('Unknown node type: ' + node.type);
    }
  }
  
  // 生成目标代码
  const generatedCode = codeGeneration(ast);
  console.log(generatedCode);
