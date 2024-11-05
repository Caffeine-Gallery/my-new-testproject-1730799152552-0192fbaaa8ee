import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.keypad button, .btn-danger');
    let currentInput = '';
    let currentOperation = null;
    let previousInput = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value >= '0' && value <= '9' || value === '.') {
                currentInput += value;
                display.value = currentInput;
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput !== '') {
                    if (previousInput !== '') {
                        calculate();
                    } else {
                        previousInput = currentInput;
                    }
                }
                currentOperation = value;
                currentInput = '';
            } else if (value === '=') {
                calculate();
            } else if (value === 'Clear') {
                clear();
            }
        });
    });

    async function calculate() {
        if (previousInput !== '' && currentInput !== '' && currentOperation) {
            const num1 = parseFloat(previousInput);
            const num2 = parseFloat(currentInput);
            let result;

            switch (currentOperation) {
                case '+':
                    result = await backend.add(num1, num2);
                    break;
                case '-':
                    result = await backend.subtract(num1, num2);
                    break;
                case '*':
                    result = await backend.multiply(num1, num2);
                    break;
                case '/':
                    if (num2 !== 0) {
                        result = await backend.divide(num1, num2);
                    } else {
                        display.value = 'Error: Division by zero';
                        return;
                    }
                    break;
            }

            display.value = result;
            previousInput = result.toString();
            currentInput = '';
            currentOperation = null;
        }
    }

    function clear() {
        currentInput = '';
        previousInput = '';
        currentOperation = null;
        display.value = '';
    }
});
