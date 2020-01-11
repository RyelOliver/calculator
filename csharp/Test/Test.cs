using System;
using System.Collections.Generic;

namespace Test
{
	public class TestThrows {
		public Type Type;
		public string Message;
		public Boolean checkType = false;

		public TestThrows(string Message) {
			this.Message = Message;
		}

		public TestThrows(Exception Exception) {
			this.Message = Exception.Message;
			this.Type = Exception.GetType();
			this.checkType = true;
		}
	}

    public class TestCase {
        public string Description;
        public Action<TestCase> Test;
		public TestThrows ExpectedException;
		public TestThrows ReceivedException;
        public string Expected;
        public string Received;
		public Boolean shouldThrow = false;
		public Boolean didThrow = false;

        public TestCase(string Description, Action<TestCase> Test, string Expected) {
            this.Description = Description;
            this.Test = Test;
            this.Expected = Expected;
        }

        public TestCase(string Description, Action<TestCase> Test, TestThrows Exception) {
            this.Description = Description;
            this.Test = Test;
            this.ExpectedException = Exception;
			this.shouldThrow = true;
        }

        public Boolean ToPass() {
			if (this.shouldThrow) {
				return this.ReceivedException != null &&
					this.ExpectedException.Type == this.ReceivedException.Type &&
					this.ExpectedException.Message == this.ReceivedException.Message;
			} else {
	            return this.Expected == this.Received;
			}
        }
    }

    public class TestRunner {
        List<TestCase> TestCases;
        ConsoleColor bgColor = Console.BackgroundColor;
        ConsoleColor fgColor = Console.ForegroundColor;

        public TestRunner(List<TestCase> TestCases) {
            this.TestCases = TestCases;
        }

        void TestPass(string testDescription) {
            Console.BackgroundColor = ConsoleColor.Green;
            Console.ForegroundColor = ConsoleColor.Black;
            Console.Write(" PASS ");
            Console.BackgroundColor = bgColor;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(" ");
            Console.WriteLine(testDescription);

            Console.BackgroundColor = bgColor;
            Console.ForegroundColor = fgColor;
        }

        void TestFail(string testDescription) {
            Console.BackgroundColor = ConsoleColor.Red;
            Console.ForegroundColor = ConsoleColor.Black;
            Console.Write(" FAIL ");
            Console.BackgroundColor = bgColor;
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write(" ");

            Console.WriteLine(testDescription);

            Console.BackgroundColor = bgColor;
            Console.ForegroundColor = fgColor;
        }

        public void Run() {
			int testCount = this.TestCases.Count;
			int failedCount = 0;
			int passedCount = 0;

			DateTime startTime = DateTime.Now;
            foreach (TestCase TestCase in this.TestCases) {	
				if (TestCase.shouldThrow) {
					try {
	                	TestCase.Test(TestCase);
					} catch (Exception exception) {
						TestCase.didThrow = true;
						TestCase.ReceivedException = new TestThrows(exception);
					}
				} else {
                	TestCase.Test(TestCase);
				}

				Boolean passed = TestCase.ToPass();
				if (passed) {
					passedCount++;
                    TestPass(TestCase.Description);
				} else {
					failedCount++;
					TestFail(TestCase.Description);

                    Console.WriteLine("");
                    Console.Write("\tExpected ");
					Console.ForegroundColor = ConsoleColor.Green;

					if (TestCase.shouldThrow) {
						if (TestCase.didThrow) {
							if (TestCase.ExpectedException.checkType) {
								Console.Write("{0}: ", TestCase.ExpectedException.Type);
							}
							Console.WriteLine(TestCase.ExpectedException.Message);
						} else {
							Console.WriteLine("to throw");
						}
					} else {
						Console.WriteLine(TestCase.Expected);				
					}
					
					Console.ForegroundColor = fgColor;
                    Console.Write("\tReceived ");
					Console.ForegroundColor = ConsoleColor.Red;

					if (TestCase.shouldThrow) {
						if (TestCase.didThrow) {
							if (TestCase.ExpectedException.checkType) {
								Console.Write("{0}: ", TestCase.ReceivedException.Type);
							}
							Console.WriteLine(TestCase.ReceivedException.Message);
						} else {
							Console.WriteLine("did not throw");
						}
					} else {
						Console.WriteLine(TestCase.Received);					
					}
					
					Console.BackgroundColor = bgColor;
					Console.ForegroundColor = fgColor;
                    Console.WriteLine("");
				}
			}
			DateTime endTime = DateTime.Now;

			Console.WriteLine("");
			Console.Write("Tests: ");

			if (failedCount > 0) {
				Console.ForegroundColor = ConsoleColor.Red;
				Console.Write("{0} failed", failedCount);
				Console.ForegroundColor = fgColor;
				Console.Write(", ");
			}

			if (passedCount > 0) {
				Console.ForegroundColor = ConsoleColor.Green;
				Console.Write("{0} passed", passedCount);
				Console.ForegroundColor = fgColor;
				Console.Write(", ");
			}
			
			Console.WriteLine("{0} total", testCount);
			Console.WriteLine("Time: {0}s", Math.Round((endTime - startTime).TotalSeconds, 3));
		}
    }
}