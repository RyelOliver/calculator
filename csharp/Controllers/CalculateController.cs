using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Calculation;

namespace Calculator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculateController : ControllerBase
    {
        // GET api/calculate
        [HttpGet]
        public ActionResult<string> Get([FromQuery] string expression)
        {
            Expression parsed = ExpressionParser.Parse(expression);
            return parsed.Evaluate().ToString();
        }
    }
}
