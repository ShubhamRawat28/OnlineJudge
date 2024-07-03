import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarComponent from './NavbarComponent';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("python"); // Default language
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(""); // To store the output of the run API

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/problems/${id}`);
        setProblem(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleRun = async () => {
    try {
      const response = await axios.post('http://localhost:8000/run', {
        language,
        code
      });
      setOutput(response.data.output); // Assuming the API returns { output: "..." }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput("Error running code");
    }
  };

  const handleSubmit = () => {
    // Handle the submit functionality
    console.log('Submit button clicked');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!problem) return <p>No problem found</p>;

  return (
    <div>
      <NavbarComponent />
      <SplitterLayout>
        <div style={{ padding: '10px' }}>
          <h1 className='text-red-600'>{problem.name}</h1>
          <p>{problem.statement}</p>
        </div>
        <div style={{ padding: '10px' }}>
          <div>
            <label htmlFor="language">Language:</label>
            <select id="language" value={language} onChange={handleLanguageChange}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <textarea
            style={{ width: '100%', height: '200px' }}
            placeholder="Write your code here..."
            value={code}
            onChange={handleCodeChange}
          ></textarea>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleRun} style={{ marginRight: '10px' }}>Run</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {output && (
            <div style={{ marginTop: '10px' }}>
              <h2>Output:</h2>
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </SplitterLayout>
    </div>
  );
};

export default ProblemDetail;