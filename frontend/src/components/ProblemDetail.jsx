import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./ui/resizable";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Editor } from "@monaco-editor/react";
import { ReloadIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { Tabs } from "flowbite-react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const ProblemDetail = () => {
	const { id } = useParams();
	const [problem, setProblem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [running, setRunning] = useState(false);
	const [input, setInput] = useState(""); // To store the input for the run API
	const [error, setError] = useState(null);
	const [language, setLanguage] = useState("python"); // Default language
	const [code, setCode] = useState("");
	const [output, setOutput] = useState(""); // To store the output of the run API
	const [activeTab, setActiveTab] = useState(1);
	const [defaultCode, setDefaultCode] = useState("## Write your code here");

	const [testCases, setTestCases] = useState([
		{ input: "4\n2 7 11 15\n 9", expectedOutput: "0 1\n", output: "", isMatch: null },
		{ input: "3\n3 2 4\n 6", expectedOutput: "1 2\n", output: "", isMatch: null },
	]);
	const [manualTestCases, setManualTestCases] = useState([
		{ input: "", expectedOutput: "", output: "", isMatch: null },
	]);

	useEffect(() => {
		const fetchProblem = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/problems/${id}`
				);
				setProblem(response.data);
				setLoading(false);
			} catch (err) {
				setError("Error fetching data");
				setLoading(false);
			}
		};

		fetchProblem();
	}, [id]);

	const handleLanguageChange = (lang) => {
		// Handle the language change
		let boilerplateCode;

		if (lang === "python") {
			boilerplateCode = `"""
  Write your Python code here
  """
  
  def main():
    print("Hello, World!")
  
  if __name__ == "__main__":
    main()`;
		} else if (lang === "javascript") {
			boilerplateCode = `// Write your JavaScript code here
  
  function main() {
    console.log("Hello, World!");
  }
  
  main();`;
		} else if (lang === "java") {
			boilerplateCode = `// Write your Java code here
  
  public class Main {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }`;
		} else if (lang === "cpp") {
			boilerplateCode = `// Write your C++ code here
  
  #include <iostream>
  
  using namespace std;
  
  int main() {
    cout << "Hello, World!" << endl;
    return 0;
  }`;
		}

		setDefaultCode(boilerplateCode);
		setLanguage(lang);
	};

	const handleCodeChange = (value, event) => {
		console.log(value);
		setCode(value);
	};

	const getToken = () => {
		return localStorage.getItem("token");
	};

	const handleRun = async () => {
		try {
			setRunning(true);
			const token = getToken();
			const testCaseList = activeTab === 1 ? testCases : manualTestCases;

			for(let i = 0; i < testCaseList.length; i++) {
			const response = await axios.post(
				"http://localhost:8000/run",
				{
					language,
					code,
					input: testCaseList[i].input,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setRunning(false);
			const updatedTestCases = [...testCaseList];
			updatedTestCases[i].output = response.data.output;
			updatedTestCases[i].isMatch =
				response.data.output.trim() === testCaseList[i].expectedOutput.trim();
			if (activeTab === 1) {
				setTestCases(updatedTestCases);
			}
			else {
				setManualTestCases(updatedTestCases);
			}
		}
		} catch (error) {
			console.error("Error running code:", error);
			setOutput("Error running code");
			setRunning(false);
		}
	};

	const handleSubmit = async () => {
		console.log("Submit button clicked");
		try {
			const token = getToken();
			const response = await axios.post(
				"http://localhost:8000/submit",
				{
					language,
					code,
					problem,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.data);
			setOutput(response.data.msg); // Assuming the API returns { output: "..." }
		} catch (error) {
			console.error("Error running code:", error);
			setOutput("Error running code");
		}
	};

	const handleRunTestCase = async (index, isManual = false) => {
		try {
			const token = getToken();
			const testCaseList = isManual ? manualTestCases : testCases;
			const currentTestCase = testCaseList[index];
			const response = await axios.post(
				"http://localhost:8000/run",
				{
					language,
					code,
					input: currentTestCase.input,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const updatedTestCases = [...testCaseList];
			updatedTestCases[index].output = response.data.output;
			updatedTestCases[index].isMatch =
				response.data.output.trim() === currentTestCase.expectedOutput.trim();
			if (isManual) {
				setManualTestCases(updatedTestCases);
			} else {
				setTestCases(updatedTestCases);
			}
		} catch (error) {
			console.error("Error running test case:", error);
		}
	};

	const addManualTestCase = () => {
		setManualTestCases([
			...manualTestCases,
			{ input: "", expectedOutput: "", output: "", isMatch: null },
		]);
	};

	const handleManualTestCaseChange = (index, field, value) => {
		const updatedManualTestCases = [...manualTestCases];
		updatedManualTestCases[index][field] = value;
		setManualTestCases(updatedManualTestCases);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;
	if (!problem) return <p>No problem found</p>;

	return (
		<div>
			<NavbarComponent />
			<div>
				<ResizablePanelGroup
					direction="horizontal"
					className="w-full h-full rounded-lg border overflow-auto"
				>
					<ResizablePanel defaultSize={50} className="overflow-auto">
						<div className="p-6 overflow-auto h-screen">
							<h1 className="text-4xl m-3 ml-0 capitalize">
								{problem.code}.{problem.name}
							</h1>
							<main className="flex min-w-0">
								<pre className="whitespace-pre-wrap">{problem.statement}</pre>
							</main>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle className="p-1 bg-blue-800" />
					<ResizablePanel defaultSize={50} className="h-screen">
						<ResizablePanelGroup direction="vertical">
							<ResizablePanel
								defaultSize={50}
								className="bg-none overflow-auto"
							>
								<div className="overflow-auto p-2">
									<div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" className="w-28">
													{language}
													<CaretSortIcon />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-10 ml-8">
												<DropdownMenuLabel>Languages</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuItem
														onSelect={() => handleLanguageChange("python")}
													>
														Python
													</DropdownMenuItem>
													<DropdownMenuItem
														onSelect={() => handleLanguageChange("javascript")}
													>
														JavaScript
													</DropdownMenuItem>
													<DropdownMenuItem
														onSelect={() => handleLanguageChange("java")}
													>
														Java
													</DropdownMenuItem>
													<DropdownMenuItem
														onSelect={() => handleLanguageChange("cpp")}
													>
														C++
													</DropdownMenuItem>
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									<Editor
										height="calc(100vh - 200px)"
										defaultLanguage="cpp"
										defaultValue={defaultCode}
										onChange={handleCodeChange}
										className="p-2 border-3 border-gray-200 dark:border-neutral-700"
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle className="p-1 bg-blue-800" />
							<ResizablePanel
								defaultSize={50}
								className="bg-none overflow-auto"
							>
								<div className="overflow-auto p-2">
									<div className="w-full">
										<nav className="relative z-0 rounded-lg flex divide-x">
											<button
												type="button"
												className={`hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap rounded ${
													activeTab === 1
														? "text-blue-600 border-blue-600 font-semibold bg-gray-700"
														: "text-gray-500 hover:text-blue-600 hover:bg-gray-500"
												} focus:outline-none focus:text-blue-600 focus:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500`}
												id="tabs-with-underline-item-1"
												onClick={() => setActiveTab(1)}
												role="tab"
												aria-controls="tabs-with-underline-1"
											>
												Sample Test Cases
											</button>
											<button
												type="button"
												className={`hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap rounded ${
													activeTab === 2
														? "text-blue-600 border-blue-600 font-semibold bg-gray-700"
														: "text-gray-500 hover:text-blue-600 hover:bg-gray-500"
												} focus:outline-none focus:text-blue-600 focus:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500`}
												id="tabs-with-underline-item-2"
												onClick={() => setActiveTab(2)}
												role="tab"
												aria-controls="tabs-with-underline-2"
											>
												Manual Test Cases
											</button>
											<div className="flex space-x-4 ml-25">
											<Button onClick={handleRun} className="w-28 ml-10">
												Run
											</Button>
											<Button onClick={handleSubmit} className="w-28">
												Submit
											</Button>
											<Button
												onClick={addManualTestCase}
												className={activeTab === 2 ? "" : "hidden"}
											>
												+
											</Button>
											</div>
										</nav>
									</div>

									<div className="mt-3">
										<div
											id="tabs-with-underline-1"
											role="tabpanel"
											aria-labelledby="tabs-with-underline-item-1"
											className={activeTab === 1 ? "" : "hidden"}
										>
											<p className="text-gray-500 dark:text-neutral-400">
												<Tabs aria-label="Input tabs" variant="fullWidth">
													{testCases.map((testCase, index) => (
														<Tabs.Item
															key={index}
															title={`Test Case ${index + 1}`}
														>
															<div>
																<div>
																	<label>Input:</label>
																	<textarea
																		readOnly
																		style={{ width: "100%", height: "50px" }}
																		value={testCase.input}
																		className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
																	></textarea>
																</div>
																<div>
																	<label>Output:</label>
																	<textarea
																		readOnly
																		style={{ width: "100%", height: "50px" }}
																		value={testCase.output} className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
																	></textarea>
																</div>
																<div>
																	<label>Expected Output:</label>
																	<textarea
																		readOnly
																		style={{ width: "100%", height: "50px" }}
																		value={testCase.expectedOutput} className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
																	></textarea>
																</div>
																{testCase.isMatch !== null && (
																	<div>
																		{testCase.isMatch ? (
																			<AiOutlineCheck color="green" />
																		) : (
																			<AiOutlineClose color="red" />
																		)}
																	</div>
																)}
															</div>
														</Tabs.Item>
													))}
												</Tabs>
											</p>
										</div>
										<div
											id="tabs-with-underline-2"
											role="tabpanel"
											aria-labelledby="tabs-with-underline-item-2"
											className={activeTab === 2 ? "" : "hidden"}
										>
											<div style={{ marginTop: "10px" }}>
												<Tabs aria-label="Output tabs" variant="fullWidth">
													{manualTestCases.map((testCase, index) => (
														<Tabs.Item
															key={`manual-${index}`}
															title={`Test Case ${index + 1}`}
														>
															<div>
																<div>
																	<label>Input:</label>
																	<textarea
																		style={{ width: "100%", height: "50px" }}
																		value={testCase.input}
																		onChange={(e) =>
																			handleManualTestCaseChange(
																				index,
																				"input",
																				e.target.value
																			)
																		} className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
																	></textarea>
																</div>
																<div>
																	<label>Output:</label>
																	<textarea
																		readOnly
																		style={{ width: "100%", height: "50px" }}
																		value={testCase.output} className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
																	></textarea>
																</div>
																<div>
																	<label>Expected Output:</label>
																	<textarea
																		style={{ width: "100%", height: "50px" }}
																		value={testCase.expectedOutput}
																		onChange={(e) =>
																			handleManualTestCaseChange(
																				index,
																				"expectedOutput",
																				e.target.value
																			)
																		} className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
																	></textarea>
																</div>
																{testCase.isMatch !== null && (
																	<div>
																		{testCase.isMatch ? (
																			<AiOutlineCheck color="green" />
																		) : (
																			<AiOutlineClose color="red" />
																		)}
																	</div>
																)}
															</div>
														</Tabs.Item>
													))}
												</Tabs>
											</div>
										</div>
									</div>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default ProblemDetail;
