using System;
using System.Collections.Generic;
using Test;
using Calculation;

class Program
{
	static Action<TestCase> TestExpression(string input) {
		return TestCase => {
			Expression expression = ExpressionParser.Parse(input);
			TestCase.Received = expression.Evaluate().ToString();
		};
	}
	static void Main(string[] args)
	{
		TestRunner testRunner = new TestRunner(new List<TestCase> {
			new TestCase("Basic positive", TestExpression("+17"), "17"),
			new TestCase("Basic negative", TestExpression("-17"), "-17"),
			new TestCase("Basic addition", TestExpression("2+3"), "5"),
			new TestCase("Basic subtraction", TestExpression("7-5"), "2"),
			new TestCase("Basic multiplication", TestExpression("11*13"), "143"),
			new TestCase("Basic division", TestExpression("12/4"), "3"),
			new TestCase("Basic exponentiation", TestExpression("2^3"), "8"),
			new TestCase("Multiplication and addition precedence", TestExpression("4+5*2"), "14"),
			new TestCase("Division and addition precedence", TestExpression("4+5/2"), "6.5"),
			new TestCase("Division, addition and subtraction precedence", TestExpression("4+5/2-1"), "5.5"),
			new TestCase("Exponentiation precedence", TestExpression("2^3^2"), "512"),
			new TestCase("Exponentiation and division precedence", TestExpression("2^3^2/4"), "128"),
			new TestCase("Complex precedence", TestExpression("256-2^3^2/4+1"), "129"),

			new TestCase("Empty expression", TestExpression(""), new TestThrows(new NullReferenceException("Nothing to parse."))),
			new TestCase("Missing first operand", TestExpression("*5"), new TestThrows(new FormatException($"Binary operation `{"*5"}` requires two operands."))),
			new TestCase("Missing second operand", TestExpression("5/"), new TestThrows(new FormatException($"Binary operation `{"5/"}` requires two operands."))),
			new TestCase("Division by 0", TestExpression("4/0"), new TestThrows(new DivideByZeroException("Attempted to divide by zero."))),
		});
		testRunner.Run();
	}
}