using System;
using System.Collections.Generic;

namespace Calculation
{
    public class Expression {
		public virtual double Evaluate() {
			throw new NotImplementedException();
		}

		public override string ToString() {
			throw new NotImplementedException();
		}
	}

	class Operand : Expression {
		double Value;

		public Operand(double Value) {
			this.Value = Value;
		}

		public override double Evaluate() {
			return this.Value;
		}
		
		public override string ToString() {
			return this.Value.ToString();
		}
	}

	class Operation : Expression {}

	class UnaryOperation : Operation {
		public Expression Operand;

		public UnaryOperation(Expression Operand) {
			this.Operand = Operand;
		}
	}

	class Positive : UnaryOperation {
		public Positive(Expression Operand) : base(Operand) {}

		public override double Evaluate() {
			return this.Operand.Evaluate();
		}

		public override string ToString() {
			return this.Operand.ToString();
		}
	}

	class Negative : UnaryOperation {
		public Negative(Expression Operand) : base(Operand) {}

		public override double Evaluate() {
			return - this.Operand.Evaluate();
		}

		public override string ToString() {
			return $" - {this.Operand.ToString()}";
		}
	}

	class BinaryOperation : Operation {
		public Expression Left;
		public Expression Right;

		public BinaryOperation(Expression Left, Expression Right) {
			this.Left = Left;
			this.Right = Right;
		}
	}

	class Addition : BinaryOperation {
		public Addition(Expression Left, Expression Right) : base(Left, Right) {}

		public override double Evaluate() {
			double augend = this.Left.Evaluate();
			double addend = this.Right.Evaluate();
			return augend + addend;
		}

		public override string ToString() {
			string augend = this.Left.ToString();
			string addend = this.Right.ToString();
			return String.Format("({0} {1} {2})", augend, "+", addend);
		}
	}
	
	class Subtraction : BinaryOperation {
		public Subtraction(Expression Left, Expression Right) : base(Left, Right) {}

		public override double Evaluate() {
			double minuend = this.Left.Evaluate();
			double subtrahend = this.Right.Evaluate();
			return minuend - subtrahend;
		}

		public override string ToString() {
			string minuend = this.Left.ToString();
			string subtrahend = this.Right.ToString();
			return String.Format("({0} {1} {2})", minuend, "-", subtrahend);
		}
	}

	class Multiplication : BinaryOperation {
		public Multiplication(Expression Left, Expression Right) : base(Left, Right) {}

		public override double Evaluate() {
			double multiplicand = this.Left.Evaluate();
			double multiplier = this.Right.Evaluate();
			return multiplicand * multiplier;
		}

		public override string ToString() {
			string multiplicand = this.Left.ToString();
			string multiplier = this.Right.ToString();
			return String.Format("({0} {1} {2})", multiplicand, "*", multiplier);
		}
	}

	class Division : BinaryOperation {
		public Division(Expression Left, Expression Right) : base(Left, Right) {}

		public override double Evaluate() {
			double dividend = this.Left.Evaluate();
			double divisor = this.Right.Evaluate();
			if (divisor == 0) {
				throw new DivideByZeroException();
			}
			return dividend / divisor;
		}

		public override string ToString() {
			string dividend = this.Left.ToString();
			string divisor = this.Right.ToString();
			return String.Format("({0} {1} {2})", dividend, "/", divisor);
		}
	}

	class Exponentiation : BinaryOperation {
		public Exponentiation(Expression Left, Expression Right) : base(Left, Right) {}

		public override double Evaluate() {
			double baseNumber = this.Left.Evaluate();
			double exponent = this.Right.Evaluate();
			return Math.Pow(baseNumber, exponent);
		}

		public override string ToString() {
			string baseNumber = this.Left.ToString();
			string exponent = this.Right.ToString();
			return String.Format("({0} {1} {2})", baseNumber, "^", exponent);
		}
	}

	class OperationParser {
		public string BinaryOperator;
		public Func<Expression, Expression, Expression> BinaryOperationType;
		public Func<Expression, Expression> UnaryOperationType;

		public OperationParser(string BinaryOperator, Func<Expression, Expression, Expression> BinaryOperationType) {
			this.BinaryOperator = BinaryOperator;
			this.BinaryOperationType = BinaryOperationType;
		}

		public OperationParser(string BinaryOperator, Func<Expression, Expression, Expression> BinaryOperationType, Func<Expression, Expression> UnaryOperationType) {
			this.BinaryOperator = BinaryOperator;
			this.BinaryOperationType = BinaryOperationType;
			this.UnaryOperationType = UnaryOperationType;
		}
	}

    public class ExpressionParser {
		public static Expression Parse(string input) {
            if (String.IsNullOrWhiteSpace(input)) {
                throw new NullReferenceException("Nothing to parse.");
            }

			Stack<OperationParser> binaryOperators = new Stack<OperationParser>(new[] {
				new OperationParser("^", (Left, Right) => new Exponentiation(Left, Right)),
				new OperationParser("/", (Left, Right) => new Division(Left, Right)),
				new OperationParser("*", (Left, Right) => new Multiplication(Left, Right)),
			});

			Stack<OperationParser> binaryOrUnaryOperators = new Stack<OperationParser>(new[] {
				new OperationParser("-", (Left, Right) => new Subtraction(Left, Right), Operand => new Negative(Operand)),
				new OperationParser("+", (Left, Right) => new Addition(Left, Right), Operand => new Positive(Operand)),
			});

			while (binaryOrUnaryOperators.Count > 0) {
				OperationParser operation = binaryOrUnaryOperators.Pop();

                int operatorIndex = input.IndexOf(operation.BinaryOperator);
				if (operatorIndex >= 0) {
					Expression left;
					Expression right;
					try {
						right = Parse(input.Substring(operatorIndex + 1, input.Length - (operatorIndex + 1)));
					} catch (NullReferenceException) {
						throw new FormatException($"Binary operation `{input}` requires two operands.");
					}
					try {
						left = Parse(input.Substring(0, operatorIndex));
					} catch (NullReferenceException) {
						return operation.UnaryOperationType(right);
					}
					return operation.BinaryOperationType(left, right);
				}
			}

			while (binaryOperators.Count > 0) {
				OperationParser operation = binaryOperators.Pop();

                int operatorIndex = input.IndexOf(operation.BinaryOperator);
				if (operatorIndex >= 0) {
					Expression left;
					Expression right;
					try {
						left = Parse(input.Substring(0, operatorIndex));
						right = Parse(input.Substring(operatorIndex + 1, input.Length - (operatorIndex + 1)));
					} catch (NullReferenceException) {
						throw new FormatException($"Binary operation `{input}` requires two operands.");
					}
					return operation.BinaryOperationType(left, right);
				}
			}

			return new Operand(Double.Parse(input));
		}
	}
}
