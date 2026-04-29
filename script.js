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
    "X,T,θ,n" : "x",
    "sto→" : ">",
    "log" : "l",
    "ln" : "n",
    "√" : "r",
    "x⁻¹" : "i",
    "" : "",
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
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

let x = 0;

const allowedKeys = ['0','1','2','3','4','5','6','7','8','9',
    '.','+','-','*','/','^','(',')', '(-)', 's', 'c', 't', 'm',
    'x', '>', 'x²', 'l', 'n', 'r', 'i'];
const operators = ['+','-','*','/','^','x²', 'i'];

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
            else if (key == ">" && expressionDisp.at(-1) == 'x' && !expressionDisp.includes('→')) {
                expressionDisp += '→';
                expression += '='
                carrot += '→';
            }
            else if (key == "x²") {
                expressionDisp += '^2';
                expression += '**2'
                carrot += '**2';
            }
            else if (key == "l") {
                expressionDisp += 'log(';
                expression += 'Math.log10('
                carrot += 'log(';
            }
            else if (key == "n") {
                expressionDisp += 'ln(';
                expression += 'Math.log('
                carrot += 'ln(';
            }
            else if (key == "r") {
                expressionDisp += '√(';
                expression += 'Math.sqrt('
                carrot += '√(';
            }
            else if (key == "i") {
                expressionDisp += '^-1';
                expression += '**-1'
                carrot += '**-1';
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
            else if (key != '>') {
                expression += key;
                expressionDisp += key;
                carrot += key;
            }
            if(expressionDisp.length <= 22) {
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
            if (expressionDisp.at(-1) == '→') {
                expression = expression.slice(0, -2);
                expressionDisp = expressionDisp.slice(0, -1);
                carrot = carrot.slice(0,-1);
            }
            if (expressionDisp.at(-2) == 'g') {
                expression = expression.slice(0, -4);
                expressionDisp = expressionDisp.slice(0, -11);
                carrot = carrot.slice(0,-4);
            }
            if (expressionDisp.at(-2) == 'n' && expressionDisp.at(-3) == 'l') {
                expression = expression.slice(0, -3);
                expressionDisp = expressionDisp.slice(0, -9);
                carrot = carrot.slice(0,-3);
            }
            if (expressionDisp.at(-2) == '√') {
                expression = expression.slice(0, -2);
                expressionDisp = expressionDisp.slice(0, -10);
                carrot = carrot.slice(0,-2);
            }
            else {
                expression = expression.slice(0, -1);
                expressionDisp = expressionDisp.slice(0, -1);
                carrot = carrot.slice(0,-1);
            }
            if (expressionDisp.length <= 22) {
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
                justExpressed = expression;
                if (mode == 'degrees') {
                    expression = expression.replaceAll('Math.sin(', 'Math.sin(Math.PI/180*');
                    expression = expression.replaceAll('Math.cos(', 'Math.cos(Math.PI/180*');
                    expression = expression.replaceAll('Math.tan(', 'Math.tan(Math.PI/180*');
                }
                expression = expression.replaceAll(')(', ')*(');
                const parens = countParens(expression);
                for (i = parens; i > 0; i--) {
                    expression += ')';
                }
                expression = expression.replace(/(\d)\(/g, '$1*(');
                expression = expression.replace(/(\d)\x/g, '$1*x');
                expression = expression.replace('log10*', 'log10')
                console.log(expression);
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

                justDisplayed = display.textContent;
                justResulted = String(result);
                justCarrot = carrot;

                if (justEvaluated) {
                    display1.textContent = display.textContent;
                }
                else {
                    cursor1.classList.toggle("Show", false);
                    cursor2.classList.toggle("Show", true);
                    divider.classList.toggle("Show", true);
                    display = display2;
                }

                justEvaluated = true;
            
                carrot = '';
                expression = '';
                expressionDisp = '';
                display2.textContent = '';
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
        else if (key === 'ArrowUp' && display == display2  && (!justDisplayed.includes('Ans'))) {
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