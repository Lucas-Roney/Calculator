// Turn the screen on when on is clicked
const on = document.querySelector("#on");
const screen = document.querySelector("#Screen");
const cursor1 = document.querySelector("#Cursor");
const cursor2 = document.querySelector("#Cursor2");

on.addEventListener("click", () => {
    if (!screen.classList.contains("On")) {
    screen.classList.toggle("On", true);
    cursor1.classList.toggle("Show", true);
    }
});


// Give buttons and keyboard presses meaning
const buttonMap = {
    "del" : "Backspace",
    "clear" : "Escape",
    "x" : "*",
    "÷" : "/",
    "enter" : "Enter",
    "sin" : "s",
    "cos" : "c",
    "tan" : "t",
    "mode" : "m",
    "" : "",
}

document.addEventListener('keydown', function(event) {
    Call_keydown(event.key);
});

document.querySelector("#Button-Grid-Container").addEventListener('click', function(event) {
    const button = event.target;
    // check what button was clicked and call Call_keydown with the right key
    const label = button.textContent;
    const key = buttonMap[label] ?? label;
    Call_keydown(key);
    button.blur();
});

let expression = "";
let expressionDisp = "";
let carrot = "";
let mode = 'radians';
let result_text = document.querySelector("#Result-Text");

let justEvaluated = false;
let justDisplayed = '';
let justExpressed = '';
let justResulted = '';
let justCarrot = '';
let justMode1 = false;
let justMode2 = false;
let oldResulted = '';

const display1 = document.querySelector("#Display-Text");
const display2 = document.querySelector("#Display-Text2");
let display = display1;
const divider = document.querySelector("#Display_Divider")

let currDisplay1 = '';
let currDisplay2 = '';
let currResult = '';

const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','^','(',')', '(-)', 's', 'c', 't', 'm'];
const operators = ['+','-','*','/','^'];

function countParens(str) {
    return str.split('(').length - str.split(')').length;
}

function Call_keydown(key) {
    if (screen.classList.contains("On")) {

        // Check if mode message
        if (justMode1) {
            display1.textContent = currDisplay1;
            cursor1.classList.toggle("Show", true);
            display = display1;
            justMode1 = false;
            return;
        }
        if (justMode2) {
            display1.textContent = currDisplay1;
            result_text.textContent = currResult;
            divider.classList.toggle("Show", true);
            display2.textContent = currDisplay2;
            cursor2.classList.toggle("Show", true);
            display = display2;
            justMode2 = false;
            return;
        }

        //Start new line if just evaluated
        if (justEvaluated) {
            display = display2;
        }

        //Consider operator meaning ans operator 
        if (!expression && justEvaluated && operators.includes(key)) {
            expression = justResulted;
            expressionDisp = "Ans";
            carrot = justCarrot;
            display.textContent = expressionDisp;
            oldResulted = justResulted;
        }

        // Handle numbers and operators
        if (allowedKeys.includes(key)) {
            if(key == '^') {
                expressionDisp += '^';
                expression += '**';
                carrot += '^';
            }
            else if (key == '(-)') {
                expressionDisp += '(-';
                expression += '(-';
                carrot += '(-';
            }
            else if (key == "s") {
                expressionDisp += '(sin(';
                expression += '(Math.sin(';
                carrot += '(sin(';
            }
            else if (key == "c") {
                expressionDisp += '(cos(';
                expression += '(Math.cos(';
                carrot += '(cos(';
            }
            else if (key == "t") {
                expressionDisp += '(tan(';
                expression += '(Math.tan(';
                carrot += '(tan(';
            }
            else if (key == "m") {
                currDisplay1 = display1.textContent;
                currDisplay2 = display2.textContent;
                currResult = result_text.textContent;
                if (display == display1) {
                    cursor1.classList.toggle("Show", false);
                    display1.textContent = '';
                    if (mode == 'radians') {
                    mode = 'degrees';
                    }
                    else {
                        mode = 'radians';
                    }
                    display.textContent = `mode changed to: ${mode}`;
                    justMode1 = true;
                    return;
                }
                if (display == display2) {
                    cursor2.classList.toggle("Show", false);
                    divider.classList.toggle("Show", false);
                    display1.textContent = '';
                    result_text.textContent = '';
                    display2.textContent = '';
                    if (mode == 'radians') {
                    mode = 'degrees';
                    }
                    else {
                        mode = 'radians';
                    }
                    display.textContent = `mode changed to: ${mode}`;
                    justMode2 = true;
                    return;
                }
                if (mode == 'radians') {
                    mode = 'degrees';
                }
                else {
                    mode = 'radians';
                }
                display.textContent = `mode changed to: ${mode}`;
                justMode = true;
                return;
            }
            else{
                expression += key;
                expressionDisp += key;
                carrot += key;
            }
            if(expression.length <= 22) {
                display.textContent = expressionDisp;
            }
            else{
                let part = expressionDisp.substring(expressionDisp.length - 22, expressionDisp.length);
                display.textContent = "◄" + part;
            }
        }

        // Handle backspace
        else if (key === 'Backspace') {
            if (expressionDisp.at(-1) == 's' && expressionDisp.at(-2) == 'n') {
                expressionDisp = expressionDisp.slice(0,-3);
                expression = expression.slice(0,-justResulted.length);
                carrot = carrot.slice(0,-justCarrot.length)
            }
            else if (expressionDisp.at(-1) == '(' && expressionDisp.at(-2) == 'n' && expressionDisp.at(-3) == 'i' || expressionDisp.at(-1) == '(' && expressionDisp.at(-2) == 'n' && expressionDisp.at(-3) == 'a' || expressionDisp.at(-1) == '(' && expressionDisp.at(-2) == 's' && expressionDisp.at(-3) == 'o') {
                expressionDisp = expressionDisp.slice(0,-5);
                expression = expression.slice(0,-10);
                carrot = carrot.slice(0,-5)
            }
            if (carrot.at(-1) == '^') {
                expression = expression.slice(0, -2);
                expressionDisp = expressionDisp.slice(0, -1);
                carrot = carrot.slice(0,-1);
            }
            else {
                expression = expression.slice(0, -1);
                expressionDisp = expressionDisp.slice(0, -1);
                carrot = carrot.slice(0,-1);
            }
            if(expressionDisp.length <= 22) {
                display.textContent = expressionDisp || '';
            }
            else{
                let part = expressionDisp.substring(expression.length - 22, expression.length);
                display.textContent = "◄" + part || '';
            }
        }
        // Handle Enter or =
        else if (key === 'Enter' || key === '=') {
            try {
                // Evaluate safely
                const parens = countParens(expression);
                for (i = parens; i > 0; i--) {
                    expression += ')';
                }
                expression = expression.replace(/(\d)\(/g, '$1*(');
                if (mode == 'degrees') {
                    expression = expression.replace('Math.sin(', 'Math.sin(Math.PI/180*');
                    expression = expression.replace('Math.cos(', 'Math.cos(Math.PI/180*');
                    expression = expression.replace('Math.tan(', 'Math.tan(Math.PI/180*');
                }
                let result = Function('"use strict";return (' + expression + ')')();
                result = result.toFixed(10);
                while (result.at(-1) == '0' || result.at(-1) == '.') {
                    if (result.at(-1) == '.') {
                        result = result.slice(0,-1);
                        break;
                    }
                    result = result.slice(0,-1);
                }
                result_text.textContent = result;

                if (justEvaluated) {
                    justDisplayed = display.textContent;
                    display1.textContent = display.textContent;
                    justExpressed = expression;
                    justResulted = String(result);
                    justCarrot = carrot;
                    carrot = '';
                    expression = '';
                    expressionDisp = '';
                    display2.textContent = '';
                }
                else {
                    cursor1.classList.toggle("Show", false);
                    cursor2.classList.toggle("Show", true);
                    divider.classList.toggle("Show", true);
                    justEvaluated = true;
                    justDisplayed = display.textContent;
                    justExpressed = expression;
                    justResulted = String(result);
                    justCarrot = carrot;
                    carrot = '';
                    expression = '';
                    expressionDisp = '';
                    display = display2;
                }
            } catch {
                display.textContent = 'Error';
                expression = '';
                expressionDisp = '';
            }
        }
        // Clear with Escape
        else if (key === 'Escape') {
            expression = '';
            expressionDisp = '';
            display = display1;
            display1.textContent = '';
            display2.textContent = '';
            result_text.textContent = '';
            justEvaluated = false;
            cursor2.classList.toggle("Show", false);
            cursor1.classList.toggle("Show", true);
            divider.classList.toggle("Show", false);
        }
        else if (key === 'ArrowUp' && display == display2  && !justDisplayed.includes('Ans')) {
            display2.textContent = justDisplayed;
            expression = justExpressed;
            expressionDisp = justDisplayed;
            carrot = justCarrot;
        }
        else if (key === 'ArrowUp' && display == display2  && justDisplayed.includes('Ans')) {
            display2.textContent = justDisplayed;
            expression = justExpressed.replace(oldResulted, justResulted);
            oldResulted = justResulted
            expressionDisp = justDisplayed;
            carrot = justCarrot;
        }
        else if (key === 'ArrowDown' && display == display2) {
            display2.textContent = '';
            expression = '';
            expressionDisp = '';
            carrot = '';
        }
    }
}