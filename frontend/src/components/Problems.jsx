import React, { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react";

const Problems = () => {
	const [problems, setProblems] = useState([]);

	useEffect(() => {
		const fetchProblems = async () => {
			try {
				const response = await fetch("http://localhost:8000/problems");
				const data = await response.json();
				const sortedProblems = data.problems.sort((a, b) =>
					a.code.localeCompare(b.code)
				);

				setProblems(sortedProblems);
			} catch (error) {
				console.error("Error fetching problems:", error);
			}
		};

		fetchProblems();
	}, []);

	return (
		<div>
			<NavbarComponent />
			<div className="overflow-x-auto">
				<h1 className="text-2xl">Problems</h1>
				<Table hoverable>
					<Table.Head>
						<Table.HeadCell className="text-xl">Id</Table.HeadCell>
						<Table.HeadCell className="text-xl">Title</Table.HeadCell>
						<Table.HeadCell className="text-xl">Difficulty</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
						{problems.map((problem) => (
							<Table.Row key={problem.id}>
								<Table.Cell className="text-red-600 text-xl">{problem.code}</Table.Cell>
								<Table.Cell className="text-red-600 text-xl capitalize"><Link to={`/problems/${problem._id}`}>{problem.name}</Link></Table.Cell>
								<Table.Cell className="text-red-600 text-xl">
									{problem.difficulty}
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};

export default Problems;
