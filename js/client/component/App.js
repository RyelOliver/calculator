const React = require('react');
const { useEffect, useRef, useState } = React;
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
    const [ loading, setLoading ] = useState(false);
    const [ expression, setExpression ] = useState('');
    const [ value, setValue ] = useState('');

    useEffect(() => {
        document.addEventListener('keyup', onKeyUp);
        return () => document.removeEventListener('keyup', onKeyUp);
    });

    const refs = {};
    [ 'DEL', 'AC', ...Integers, ...Operators, '=' ]
        .forEach(character => {
            refs[character] = useRef(null);
        });

    const validCharacters = [ 'DEL', 'AC' ].concat(Integers.slice());
    if (/\d$/.test(expression))
        validCharacters.push(...Operators.concat([ '=' ]));

    const deleteCharacterFromExpression =
        () => setExpression(expression.substring(0, expression.length - 1));
    const clearExpression = () => setExpression('');

    const addCharacterToExpression = character =>
        () => setExpression(`${expression}${character}`);

    const characterPressed = character => {
        if (!validCharacters.includes(character)) return;

        refs[character].current.focus();
        switch (character) {
            case '=':
                return onSubmit();
            case 'DEL':
                return deleteCharacterFromExpression();
            case 'AC':
                return clearExpression();
            default:
                return addCharacterToExpression(character)();
        }
    };

    const onKeyUp = ({ key }) => {
        let character = key;
        if (key === 'Backspace') character = 'DEL';
        if (key === 'Delete') character = 'AC';
        characterPressed(character);
    };

    const onSubmit = () => {
        setLoading(true);
        fetch(`/calculate?expression=${encodeURIComponent(expression)}`)
            .then(response => response.json())
            .then(response => {
                setValue(response);
                setExpression(response);
                setLoading(false);
            })
            .catch(() => {
                console.error(`${expression} is invalid.`);
                setLoading(false);
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
                ref={refs[character]}
                className={loading ? `${className} loading` : className}
                onClick={onClick(character)}
                disabled={loading || !validCharacters.includes(character)}
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