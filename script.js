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

let shiftHeld = false;
let shiftLocked = false;
const secondKey = document.querySelector("#secondKey");

document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        e.preventDefault(); // stops browser selection/shrink behavior
        if (!shiftLocked) {
            shiftHeld = true;
            secondKey.classList.add("held");
            updateButtonLabels(true);
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        e.preventDefault();
        if (!shiftLocked) {
            shiftHeld = false;
            secondKey.classList.remove("held");
            updateButtonLabels(false);
        }
    }
});

secondKey.addEventListener('click', () => {
    shiftLocked = !shiftLocked;
    shiftHeld = shiftLocked;
    secondKey.classList.toggle("held", shiftLocked);
    updateButtonLabels(shiftLocked);
});


// Give buttons and keyboard presses meaning
const buttonLabelMap = {
    "del":   "ins",
    "sin":   "sin⁻¹",
    "cos":   "cos⁻¹",
    "tan":   "tan⁻¹",
    "log":   "10ˣ",
    "ln":    "eˣ",
    "^":     "π",
    "(":     "{",
    ")":     "}",
    "x²":   "x³",
    "√":    "∛",
    "x⁻¹":  "x!",
};

// Reverse map for restoring
const buttonLabelMapReverse = Object.fromEntries(
    Object.entries(buttonLabelMap).map(([k, v]) => [v, k])
);

function updateButtonLabels(shiftOn) {
    document.querySelectorAll("#Button-Grid-Container button").forEach(btn => {
        const label = btn.textContent;
        if (shiftOn && buttonLabelMap[label]) {
            btn.textContent = buttonLabelMap[label];
        } else if (!shiftOn && buttonLabelMapReverse[label]) {
            btn.textContent = buttonLabelMapReverse[label];
        }
    });
}

// Standard Button Mapping
const buttonMap = {
    "sin": "s",
    "cos": "c",
    "tan": "t",
    "log": "l",
    "ln": "n",
    "mode": "m",
    "X,T,θ,n": "x",
    "sto→": ">",
    "√": "r",
    "x⁻¹": "i",
    "del": "Backspace",
    "clear": "Escape",
    "x²": "x²",
    "(-)": "(-)"
};

// Shifted Button Mapping
const shiftButtonMap = {
    "ins":    "I",
    "clear":  "Escape",
    "sin⁻¹": "S",
    "cos⁻¹": "C",
    "tan⁻¹": "T",
    "10ˣ":   "L",
    "eˣ":    "N",
    "π":     "P",
    "{":     "{",
    "}":     "}",
    "x³":   "Q",
    "∛":    "R",
    "x!":   "F",
    "mode":  "m",
    "X,T,θ,n": "x",
    "sto→":  ">",
    "":      "",
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
    Call_keydown(event.key);
});

document.querySelector("#Button-Grid-Container").addEventListener('click', function(event) {
    const button = event.target;
    const label = button.textContent;
    const key = (shiftHeld ? shiftButtonMap[label] : buttonMap[label]) ?? label;
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
const divider = document.querySelector("#Display_Divider");

let currDisplay1 = '';
let currDisplay2 = '';
let currResult = '';

// Setup global variable target
window.x = 0;

// Added 'X' and 'x' to allowed keys to be completely safe
const allowedKeys = ['0','1','2','3','4','5','6','7','8','9',
    '.','+','-','*','/','^','(',')', '(-)', 's', 'c', 't', 'm',
    'x', 'X', '>', 'x²', 'l', 'n', 'r', 'i',
    'S', 'C', 'T', 'L', 'N', 'p', 'P', 'Q', 'R', 'F', 'I',
    '{', '}', '!'];

const operators = ['+','-','*','/','^','x²', 'i', '>', '!'];

function countParens(str) {
    return str.split('(').length - str.split(')').length;
}

function factorial(n) {
    n = Math.round(n);
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function Call_keydown(key) {
    // Safety Net: Convert physical uppercase 'X' inputs down to lowercase 'x'
    if (key === 'X') {
        key = 'x';
    }

    if (screen.classList.contains("On")) {

        // Shift Lock Guard
        if (shiftLocked && key !== 'Shift') {
            shiftLocked = false;
            shiftHeld = false;
            secondKey.classList.remove("held");
            updateButtonLabels(false);
        }

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
            else if (key == "x²") {
                expressionDisp += '^2';
                expression += '**2';
                carrot += '**2';
            }
            else if (key == "l") {
                expressionDisp += 'log(';
                expression += 'Math.log10(';
                carrot += 'log(';
            }
            else if (key == "n") {
                expressionDisp += 'ln(';
                expression += 'Math.log(';
                carrot += 'ln(';
            }
            else if (key == "r") {
                expressionDisp += '√(';
                expression += 'Math.sqrt(';
                carrot += '√(';
            }
            else if (key == "i") {
                expressionDisp += '^-1';
                expression += '**-1';
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
                return;
            }
            else if (key == "S") {
                expressionDisp += '(sin⁻¹(';
                expression += '(Math.asin(';
                carrot += '(sin⁻¹(';
            }
            else if (key == "C") {
                expressionDisp += '(cos⁻¹(';
                expression += '(Math.acos(';
                carrot += '(cos⁻¹(';
            }
            else if (key == "T") {
                expressionDisp += '(tan⁻¹(';
                expression += '(Math.atan(';
                carrot += '(tan⁻¹(';
            }
            else if (key == "L") {
                expressionDisp += '10^(';
                expression += 'Math.pow(10,';
                carrot += '10^(';
            }
            else if (key == "N") {
                expressionDisp += 'e^(';
                expression += 'Math.pow(Math.E,';
                carrot += 'e^(';
            }
            else if (key == "P" || key =="p") {
                expressionDisp += 'π';
                expression += 'Math.PI';
                carrot += 'π';
            }
            else if (key == "Q") {
                expressionDisp += '^3';
                expression += '**3';
                carrot += '^3';
            }
            else if (key == "Q" || key == "R") {
                expressionDisp += '∛(';
                expression += 'Math.cbrt(';
                carrot += '∛(';
            }
            else if (key == "F" || key == "!") {
                expressionDisp += '!';
                expression += '!';
                carrot += '!';
            }
            // Curly Brace Handling
            else if (key == "{") {
                expressionDisp += '{';
                expression += '(';
                carrot += '{';
            }
            else if (key == "}") {
                expressionDisp += '}';
                expression += ')';
                carrot += '}';
            }
            else if (key == ">" && !expressionDisp.includes('→')) {
                expressionDisp += '→';
                expression += '→';
                carrot += '→';
            }
            else if (key !== ">") {
                // Default capture for numbers/variables
                expressionDisp += key;
                expression += key;
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

        // Cleaner Backspace using endsWith()
        else if (key === 'Backspace') {
            if (expressionDisp.endsWith('Ans')) {
                expressionDisp = expressionDisp.slice(0, -3);
                expression = expression.slice(0, -justResulted.length);
                carrot = carrot.slice(0, -justCarrot.length);
            } 
            else if (expressionDisp.endsWith('(sin⁻¹(') || expressionDisp.endsWith('(cos⁻¹(') || expressionDisp.endsWith('(tan⁻¹(')) {
                expressionDisp = expressionDisp.slice(0, -7);
                expression = expression.slice(0, -10);
                carrot = carrot.slice(0, -7);
            } 
            else if (expressionDisp.endsWith('(sin(') || expressionDisp.endsWith('(cos(') || expressionDisp.endsWith('(tan(')) {
                expressionDisp = expressionDisp.slice(0, -5);
                expression = expression.slice(0, -10);
                carrot = carrot.slice(0, -5);
            } 
            else if (expressionDisp.endsWith('10^(')) {
                expressionDisp = expressionDisp.slice(0, -4);
                expression = expression.slice(0, -12); 
                carrot = carrot.slice(0, -4);
            } 
            else if (expressionDisp.endsWith('e^(')) {
                expressionDisp = expressionDisp.slice(0, -3);
                expression = expression.slice(0, -16); 
                carrot = carrot.slice(0, -3);
            } 
            else if (expressionDisp.endsWith('∛(')) {
                expressionDisp = expressionDisp.slice(0, -2);
                expression = expression.slice(0, -10); 
                carrot = carrot.slice(0, -2);
            } 
            else if (expressionDisp.endsWith('log(')) {
                expressionDisp = expressionDisp.slice(0, -4);
                expression = expression.slice(0, -11); 
                carrot = carrot.slice(0, -4);
            } 
            else if (expressionDisp.endsWith('ln(')) {
                expressionDisp = expressionDisp.slice(0, -3);
                expression = expression.slice(0, -9); 
                carrot = carrot.slice(0, -3);
            } 
            else if (expressionDisp.endsWith('√(')) {
                expressionDisp = expressionDisp.slice(0, -2);
                expression = expression.slice(0, -10); 
                carrot = carrot.slice(0, -2);
            } 
            else if (expressionDisp.endsWith('^-1')) {
                expressionDisp = expressionDisp.slice(0, -3);
                expression = expression.slice(0, -4); 
                carrot = carrot.slice(0, -4); 
            } 
            else if (expressionDisp.endsWith('^2')) {
                expressionDisp = expressionDisp.slice(0, -2);
                expression = expression.slice(0, -3); 
                carrot = carrot.slice(0, -3); 
            } 
            else if (expressionDisp.endsWith('^3')) {
                expressionDisp = expressionDisp.slice(0, -2);
                expression = expression.slice(0, -3); 
                carrot = carrot.slice(0, -2); 
            } 
            else if (expressionDisp.endsWith('(-')) {
                expressionDisp = expressionDisp.slice(0, -2);
                expression = expression.slice(0, -2);
                carrot = carrot.slice(0, -2);
            } 
            else if (carrot.endsWith('^')) { 
                expressionDisp = expressionDisp.slice(0, -1);
                expression = expression.slice(0, -2); 
                carrot = carrot.slice(0, -1);
            } 
            else if (expressionDisp.endsWith('!')) {
                expressionDisp = expressionDisp.slice(0, -1);
                expression = expression.slice(0, -1); 
                carrot = carrot.slice(0, -1);
            } 
            else if (expressionDisp.endsWith('→')) {
                expressionDisp = expressionDisp.slice(0, -1);
                expression = expression.slice(0, -1); 
                carrot = carrot.slice(0, -1);
            } 
            else {
                expression = expression.slice(0, -1);
                expressionDisp = expressionDisp.slice(0, -1);
                carrot = carrot.slice(0, -1);
            }

            if (expressionDisp.length <= 22) {
                display.textContent = expressionDisp || '';
            }
            else{
                let part = expressionDisp.substring(expressionDisp.length - 22, expressionDisp.length);
                display.textContent = "◄" + part || '';
            }
        }
        // Handle Enter or =
        else if (key === 'Enter' || key === '=') {
            try {
                justExpressed = expression;

                // --- FACTORIAL POSTFIX TO PREFIX CONVERSION ---
                while (expression.includes('!')) {
                    let idx = expression.indexOf('!');
                    let pos = idx - 1;
                    if (pos < 0) throw "Syntax Error"; 
                    
                    if (expression[pos] === ')') {
                        let parenCount = 0;
                        while (pos >= 0) {
                            if (expression[pos] === ')') parenCount++;
                            else if (expression[pos] === '(') parenCount--;
                            pos--;
                            if (parenCount === 0) break;
                        }
                    } else {
                        while (pos >= 0 && /[a-zA-Z0-9_.]/.test(expression[pos])) {
                            pos--;
                        }
                    }
                    let start = pos + 1;
                    let operand = expression.substring(start, idx);
                    if (!operand.trim()) throw "Syntax Error";
                    expression = expression.substring(0, start) + 'factorial(' + operand + ')' + expression.substring(idx + 1);
                }

                // --- VARIABLE STORE LOGIC ---
                let storeTarget = null;
                if (expression.includes('→')) {
                    let parts = expression.split('→');
                    if (parts[0] === 'x') {
                        expression = parts[1];
                        storeTarget = 'x';
                    } else if (parts[1] === 'x') {
                        expression = parts[0];
                        storeTarget = 'x';
                    } else {
                        throw "Syntax Error"; 
                    }
                }
                // --------------------------------

                if (mode == 'degrees') {
                    expression = expression.replaceAll('Math.sin(', 'Math.sin(Math.PI/180*');
                    expression = expression.replaceAll('Math.cos(', 'Math.cos(Math.PI/180*');
                    expression = expression.replaceAll('Math.tan(', 'Math.tan(Math.PI/180*');
                }
                expression = expression.replaceAll(')(', ')*(');
                const parens = countParens(expression);
                for (let i = parens; i > 0; i--) {
                    expression += ')';
                }
                expression = expression.replace(/(\d)\(/g, '$1*(');
                expression = expression.replace(/(\d)x/g, '$1*x');
                expression = expression.replace('log10*', 'log10');
                console.log(expression);
                
                let result = Function('"use strict"; const factorial = ' + factorial.toString() + '; return (' + expression + ')')();
                
                if (storeTarget === 'x') {
                    window.x = Number(result);
                }

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
            oldResulted = justResulted;
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

// Global cleanup for window blur to unlock Shift
window.addEventListener('blur', () => {
    if (!shiftLocked) {
        shiftHeld = false;
        if (typeof secondKey !== 'undefined' && secondKey !== null) {
            secondKey.classList.remove("held");
        }
        if (typeof updateButtonLabels === 'function') {
            updateButtonLabels(false);
        }
    }
});