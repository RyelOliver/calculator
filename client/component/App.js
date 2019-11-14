const React = require('react');
const { useEffect, useState } = React;
require('./App.scss');

const Integers = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
];

const Operators = [
    '+',
    '-',
    '*',
    '/',
];

module.exports = function App () {
    const [ expression, setExpression ] = useState('');
    const [ value, setValue ] = useState('');

    useEffect(() => {
        document.addEventListener('keyup', onKeyUp);
        return () => document.removeEventListener('keyup', onKeyUp);
    });

    const validCharacters = [ 'DEL', 'AC' ].concat(Integers.slice());
    if (/\d$/.test(expression))
        validCharacters.push(...Operators.concat([ '=' ]));

    const deleteCharacterFromExpression =
        () => setExpression(expression.substring(0, expression.length - 1));
    const clearExpression = () => setExpression('');

    const addCharacterToExpression = character =>
        () => setExpression(`${expression}${character}`);

    const onKeyUp = ({ key }) => {
        if (key === 'Backspace') return deleteCharacterFromExpression();
        if (key === 'Delete') return clearExpression();

        if (!validCharacters.includes(key)) return;
        if (key === '=') return onSubmit();
        return addCharacterToExpression(key)();
    };

    const onSubmit = () => {
        fetch(`/calculate?expression=${encodeURIComponent(expression)}`)
            .then(response => response.json())
            .then(response => {
                setValue(response);
                setExpression(response);
            });
    };

    const onClick = character => {
        switch (character) {
            case '=':
                return onSubmit;
            case 'DEL':
                return deleteCharacterFromExpression;
            case 'AC':
                return clearExpression;
            default:
                return addCharacterToExpression(character);
        }
    };

    const renderButton = className =>
        character => (
            <button
                key={character}
                className={className}
                onClick={onClick(character)}
                disabled={!validCharacters.includes(character)}
            >
                { character }
            </button>
        );

    return (
        <div className="calculator">
            <div className="screen">
                <code className="expression">{ expression }</code>
                <code className="value">{ value }</code>
            </div>
            <div className="buttons">
                {[ 'DEL', 'AC' ].map(renderButton('delete'))}
                {Integers.slice().reverse().map(renderButton('integer'))}
                {Operators.map(renderButton('operator'))}
                {[ '=' ].map(renderButton('equals'))}
            </div>
        </div>
    );
};