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
    "(-)" : "-",
    "enter" : "Enter",
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
});

let expression = "";
let expressionDisp = "";
let carrot = "";
let result_text = document.querySelector("#Result-Text");

let justEvaluated = false;
let justDisplayed = '';
let justExpressed = '';
let justCarrot = '';

const display1 = document.querySelector("#Display-Text");
const display2 = document.querySelector("#Display-Text2");
let display = display1;
const divider = document.querySelector("#Display_Divider")

const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','^','(',')'];
const operators = ['+','-','*','/','^'];

function Call_keydown(key) {
    if (screen.classList.contains("On")) {

        //Start new line if just evaluated
        if (justEvaluated) {
            display = display2;
        }

        //Consider operator meaning ans operator 
        if (!expression && justEvaluated && operators.includes(key)) {
            expression = justExpressed;
            expressionDisp = "Ans";
            carrot = justCarrot;
            display.textContent = expressionDisp;
        }

        // Handle numbers and operators
        if (allowedKeys.includes(key)) {
            if(key == '^') {
                expressionDisp += '^'
                expression += '**';
                carrot += '^';
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
            if (expressionDisp.at(-1) == 's' && expressionDisp.at(-2) == 'n' && expressionDisp.at(-3) == 'A') {
                expressionDisp = expressionDisp.slice(0,-3);
                expression = expression.slice(0,-justExpressed.length);
                carrot = carrot.slice(0,-justCarrot.length)
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
                const result = Function('"use strict";return (' + expression + ')')();
                result_text.textContent = result;

                if (justEvaluated) {
                    justDisplayed = display.textContent;
                    display1.textContent = justDisplayed;
                    justExpressed = String(result);
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
                    justExpressed = String(result);
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
    }
}