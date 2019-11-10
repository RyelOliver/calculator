# calculator

Write a web-based API application that evaluates a string expression consisting of non-negative
integers and the `+-*/` operators only, considering the normal mathematical rules of operator
precedence. Support for brackets is not required.

The calculation should be performed in the API not the UI and by your own code, not a third-
party library.

For example:
* an input string of `4+5*2` should output `14`
* an input string of `4+5/2` should output `6.5`
* an input string of `4+5/2-1` should output `5.5`

## Roadmap

- [x] Calculation of example expressions
- [x] API to perform calculation
- [] Expression is validated
- [] Calculation considers operator precedence
- [] UI to provide input and display output for calculation
- [] Expression is validated in UI
- [] UI is accessible
- [] UI is responsive