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
import { ReloadIcon } from "@radix-ui/react-icons";

const ProblemDetail = () => {
	const { id } = useParams();
	const [problem, setProblem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [running, setRunning] = useState(false);
	const [error, setError] = useState(null);
	const [language, setLanguage] = useState("python"); // Default language
	const [code, setCode] = useState("");
	const [output, setOutput] = useState(""); // To store the output of the run API
	const [activeTab, setActiveTab] = useState(1);
	const [defaultCode, setDefaultCode] = useState("## Write your code here");

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

	const handleCodeChange = (value, e) => {
		setCode(value);
	};

	const handleRun = async () => {
		try {
			setRunning(true);
			const response = await axios.post("http://localhost:8000/run", {
				language,
				code,
			});
			setRunning(false);
			setOutput(response.data.output); // Assuming the API returns { output: "..." }
		} catch (error) {
			console.error("Error running code:", error);
			setOutput("Error running code");
		}
	};

	const handleSubmit = async () => {
		// Handle the submit functionality
		console.log("Submit button clicked");
		try {
			const response = await axios.post("http://localhost:8000/submit", {
				language,
				code,
				problem,
			});
			console.log(response.data);
			setOutput(response.data.msg); // Assuming the API returns { output: "..." }
		} catch (error) {
			console.error("Error running code:", error);
			setOutput("Error running code");
		}
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
							<h1 className="text-4xl m-4">
								{problem.code}.{problem.name}
							</h1>
							<main className="flex min-w-0">
								<pre className="whitespace-pre-wrap whitespace-pre">
									{problem.statement}
								</pre>
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
												<Button variant="outline" className="w-20">
													{language}
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
										value={code}
										onChange={handleCodeChange}
										className="p-2 border-3 border-gray-200 dark:border-neutral-700"
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle className="p-1 bg-blue-800" />
							<ResizablePanel
								defaultSize={50}
								className="h-screen overflow-auto"
							>
								<div className="items-center justify-center p-6 overflow-auto">
									<div>
										<div className="border-b border-gray-200 dark:border-neutral-700">
											<nav
												className="flex space-x-1"
												aria-label="Tabs"
												role="tablist"
											>
												<button
													type="button"
													className={`hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap ${
														activeTab === 1
															? "text-blue-600 border-blue-600 font-semibold bg-gray-700"
															: "text-gray-500 hover:text-blue-600 hover:bg-gray-500"
													} focus:outline-none focus:text-blue-600 focus:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500`}
													id="tabs-with-underline-item-1"
													onClick={() => setActiveTab(1)}
													role="tab"
													aria-controls="tabs-with-underline-1"
												>
													Input
												</button>
												<button
													type="button"
													className={`hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap ${
														activeTab === 2
															? "text-blue-600 border-blue-600 font-semibold bg-gray-700"
															: "text-gray-500 hover:text-blue-600 hover:bg-gray-500"
													} focus:outline-none focus:text-blue-600 focus:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500`}
													id="tabs-with-underline-item-2"
													onClick={() => setActiveTab(2)}
													role="tab"
													aria-controls="tabs-with-underline-2"
												>
													Output
												</button>
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
													<h1>Input Tab</h1>
													<textarea
														style={{ width: "100%", height: "200px" }}
														placeholder="Input..."
													></textarea>
												</p>
											</div>
											<div
												id="tabs-with-underline-2"
												role="tabpanel"
												aria-labelledby="tabs-with-underline-item-2"
												className={activeTab === 2 ? "" : "hidden"}
											>
												<div style={{ marginTop: "10px" }}>
													<h2>Output:</h2>
													<pre>{output}</pre>
												</div>
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
