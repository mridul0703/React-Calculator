import React, { useState } from "react";
import Display from "./Display";
import Buttons from "./Buttons";
import "./styles/Calculator.css";

function Calculator() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");

  // Input handler
  const inputHandler = (event) => {
    if (answer === "Invalid Input!!") return;
    let val = event.target.innerText;

    if (val === "x2") val = "**2";
    else if (val === "x3") val = "**3";
    else if (val === "3√") val = "**(1/3)";
    else if (val === "log") val = "Math.log10(";

    let str = input + val;
    if (str.length > 14) return;

    if (answer !== "") {
      setInput(answer + val);
      setAnswer("");
    } else setInput(str);
  };

  // Clear screen
  const clearInput = () => {
    setInput("");
    setAnswer("");
  };

  // Check brackets are balanced
  const checkBracketBalanced = (expr) => {
    let stack = [];
    for (let i = 0; i < expr.length; i++) {
      let x = expr[i];
      if (x === "(") {
        stack.push(x);
        continue;
      }

      if (x === ")") {
        if (stack.length === 0) return false;
        else stack.pop();
      }
    }
    return stack.length === 0;
  };

  // Evaluate expression safely
  const safeEval = (expr) => {
    return Function('"use strict"; return (' + expr + ')')();
  };

  // Calculate final answer
  const calculateAns = () => {
    if (input === "") return;
    let result = 0;
    let finalexpression = input;

    finalexpression = finalexpression.replaceAll("x", "*");
    finalexpression = finalexpression.replaceAll("÷", "/");

    // Evaluate square root
    let noSqrt = input.match(/√[0-9]+/gi);

    if (noSqrt !== null) {
      let evalSqrt = input;
      for (let i = 0; i < noSqrt.length; i++) {
        evalSqrt = evalSqrt.replace(
          noSqrt[i],
          `Math.sqrt(${noSqrt[i].substring(1)})`
        );
      }
      finalexpression = evalSqrt;
    }

    try {
      // Check if brackets are balanced
      if (!checkBracketBalanced(finalexpression)) {
        const errorMessage = { message: "Brackets are not balanced!" };
        throw errorMessage;
      }
      result = safeEval(finalexpression);
    } catch (error) {
      result =
        error.message === "Brackets are not balanced!"
          ? "Brackets are not balanced!"
          : "Invalid Input!!";
    }
    isNaN(result) ? setAnswer(result) : setAnswer(Math.round(result * 1000) / 1000);
  };

  // Remove last character
  const backspace = () => {
    if (answer !== "") {
      setInput(answer.toString().slice(0, -1));
      setAnswer("");
    } else setInput((prev) => prev.slice(0, -1));
  };

  // Change prefix of expression
  const changePlusMinus = () => {
    if (answer === "Invalid Input!!") return;
    else if (answer !== "") {
      let ans = answer.toString();
      if (ans.charAt(0) === "-") {
        let plus = "+";
        setInput(plus.concat(ans.slice(1, ans.length)));
      } else if (ans.charAt(0) === "+") {
        let minus = "-";
        setInput(minus.concat(ans.slice(1, ans.length)));
      } else {
        let minus = "-";
        setInput(minus.concat(ans));
      }
      setAnswer("");
    } else {
      if (input.charAt(0) === "-") {
        let plus = "+";
        setInput((prev) => plus.concat(prev.slice(1, prev.length)));
      } else if (input.charAt(0) === "+") {
        let minus = "-";
        setInput((prev) => minus.concat(prev.slice(1, prev.length)));
      } else {
        let minus = "-";
        setInput((prev) => minus.concat(prev));
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="main">
          <Display input={input} setInput={setInput} answer={answer} />
          <Buttons
            inputHandler={inputHandler}
            clearInput={clearInput}
            backspace={backspace}
            changePlusMinus={changePlusMinus}
            calculateAns={calculateAns}
          />
        </div>
      </div>
    </>
  );
}

export default Calculator;
