const React = require('react');
const { useState } = React;
require('./App.scss');

const Integers = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
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

    const validCharacters = Integers.slice();
    if (/\d$/.test(expression))
        validCharacters.push(...Operators.concat([ '=' ]));

    const addCharacterToExpression = character =>
        () => setExpression(`${expression}${character}`);

    const onSubmit = () => {
        fetch(`/calculate?expression=${encodeURIComponent(expression)}`)
            .then(response => response.json()).then(response => {
                setValue(response);
                setExpression(response);
            });
    };

    const renderButton = className =>
        character => (
            <button
                key={character}
                className={className}
                onClick={character === '=' ?
                    onSubmit :
                    addCharacterToExpression(character)}
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
                {Integers.slice().reverse().map(renderButton('integer'))}
                {Operators.map(renderButton('operator'))}
                {[ '=' ].map(renderButton('equals'))}
            </div>
        </div>
    );
};