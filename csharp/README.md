# Calculator

Write a web-based API application that evaluates a string expression consisting of non-negative
integers and the `+-*/` operators only, considering the normal mathematical rules of operator
precedence. Support for brackets is not required.

The calculation should be performed in the API not the UI and by your own code, not a third-
party library.

For example:
* an input string of `4+5*2` should output `14`
* an input string of `4+5/2` should output `6.5`
* an input string of `4+5/2-1` should output `5.5`


## Development

In VS Code `CTRL + F5` can be used to build and launch the app.


### Testing

```
cd Calculation.Test
dotnet run
```