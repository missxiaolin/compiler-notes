// Tokenizer: 将表达式拆解为词法单元
function tokenize(expression) {
  const tokens = [];
  let current = 0;

  while (current < expression.length) {
    let char = expression[current];

    // 处理数字
    if (/\d/.test(char)) {
      let number = "";
      while (/\d/.test(char)) {
        number += char;
        char = expression[++current];
      }
      tokens.push({ type: "number", value: parseInt(number) });
      continue;
    }

    // 处理变量或函数
    if (/[a-zA-Z]/.test(char)) {
      let id = "";
      while (/[a-zA-Z]/.test(char)) {
        id += char;
        char = expression[++current];
      }

      // 跳过空格
      while (expression[current] === " ") {
        current++;
      }

      // 如果下一个字符是 '('，则标记为函数
      if (expression[current] === "(") {
        tokens.push({ type: "function", value: id });
      } else {
        tokens.push({ type: "variable", value: id });
      }
      continue;
    }

    // 处理操作符或括号
    if (char === "(" || char === ")" || char === ",") {
      tokens.push({ type: char, value: char });
      current++;
      continue;
    }

    // 处理小数点
    if (char === ".") {
      tokens.push({ type: "dot", value: "." });
      current++;
      continue;
    }

    if (char === " ") {
      current++;
      continue;
    }

    throw new TypeError("Unknown character: " + char);
  }

  return tokens;
}

// Parser: 将词法单元解析为抽象语法树
function parse(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    // 处理数字
    if (token.type === "number") {
      current++;
      return { type: "NumberLiteral", value: token.value };
    }

    // 处理函数调用
    if (token.type === "function") {
      current++;
      const node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };
      token = tokens[++current]; // 跳过 '('

      while (token.type !== ")") {
        node.params.push(walk());
        token = tokens[current];
        if (token.type === ",") {
          current++; // 跳过 ','
        }
      }

      current++; // 跳过 ')'
      return node;
    }

    // 处理变量
    if (token.type === "variable") {
      let value = token.value;
      current++;

      // 处理属性访问如 'person.age'
      while (tokens[current] && tokens[current].type === "dot") {
        current++; // 跳过 '.'

        if (tokens[current] && tokens[current].type === "variable") {
          value += "." + tokens[current].value;
          current++;
        } else {
          throw new TypeError('Expected variable after "."');
        }
      }

      return { type: "Variable", value };
    }

    throw new TypeError("Unknown token type: " + token.type);
  }

  const ast = {
    type: "Program",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

// Interpreter: 执行抽象语法树中的操作
function interpret(ast, context = {}) {
  const operators = {
    Add: (a, b) => a + b,
    Subtract: (a, b) => a - b,
    Multiply: (a, b) => a * b,
    Divide: (a, b) => a / b,
  };

  function traverseNode(node) {
    if (node.type === "NumberLiteral") {
      return node.value;
    }

    if (node.type === "Variable") {
      const keys = node.value.split(".");
      let value = context;
      for (let key of keys) {
        if (!(key in value)) {
          throw new TypeError("Unknown variable: " + key);
        }
        value = value[key];
      }
      return value;
    }

    if (node.type === "CallExpression") {
      const args = node.params.map(traverseNode);
      const func = operators[node.name];
      if (!func) {
        throw new TypeError("Unknown function: " + node.name);
      }
      return func(...args);
    }

    throw new TypeError("Unknown node type: " + node.type);
  }

  return traverseNode(ast.body[0]);
}

// 示例数据
const person = { age: 2 };
// const expression =
//   "Subtract(Add(3, Multiply(4, person.age)), Divide(6, person.age))";
const expression =
  "Multiply(Divide(Add(3, person.age), person.age), person.age)";

// 执行整个流程
const tokens = tokenize(expression);
console.log("🚀 ~ tokens:", tokens);
const ast = parse(tokens);
console.log("🚀 ~ ast:", JSON.stringify(ast));
const result = interpret(ast, { person });

console.log(result); // 输出 8
