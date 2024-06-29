const mongoose = require('mongoose');

/*{
  "statement": "string",
  "name": "string",
  "code": "string",
  "difficulty": "string (optional)",
  "test_cases": [
    {
      "input": "string",
      "output": "string"
    }
  ]
}
*/
const problemSchema = new mongoose.Schema({
    statement: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    test_cases: [
        {
            input: {
                type: String,
                required: true,
            },
            output: {
                type: String,
                required: true,
            }
        }
    ]
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
