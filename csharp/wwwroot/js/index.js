const INTEGERS = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
const OPERATONS = [ '+', '-', '*', '/', '^', '=' ]
const DELETE_KEYS = [ 'Backspace', 'Delete' ];
const NAVIGATION_KEYS = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
  'PageUp',
  'PageDown',
];
const KEYS_WHITELIST = INTEGERS.map(int => int.toString())
    .concat(OPERATONS)
    .concat(DELETE_KEYS)
    .concat(NAVIGATION_KEYS)
    .concat([ 'Enter' ]);

const $form = document.querySelector('form');
const $input = $form.querySelector('.screen > input');
const $value = $form.querySelector('.screen > .value');
const $equals = $form.querySelector('.buttons > button.equals');

function calculate(expression) {
    return fetch(`/api/calculate?expression=${encodeURIComponent(expression)}`)
        .then(response => response.json())
}

function submit() {
    return calculate($input.value)
        .then(value => {
            $value.textContent = value;
        });
}

$form.addEventListener('submit', event => {
    event.preventDefault();
    submit();
});

$input.addEventListener('keydown', event => {
    if (!KEYS_WHITELIST.includes(event.key))
        event.preventDefault();
});

$equals.addEventListener('click', () => submit());