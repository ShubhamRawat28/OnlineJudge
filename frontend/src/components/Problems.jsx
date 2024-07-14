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
				<h1>Problems</h1>
				<Table hoverable>
					<Table.Head>
						<Table.HeadCell>Id</Table.HeadCell>
						<Table.HeadCell>Title</Table.HeadCell>
						<Table.HeadCell>Difficulty</Table.HeadCell>
						<Table.HeadCell>
							<span className="sr-only">Edit</span>
						</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
						{problems.map((problem) => (
							<Link to={`/problems/${problem._id}`} key={problem.id}>
							<Table.Row key={problem.id}>
								<Table.Cell className="text-red-600">{problem.code}</Table.Cell>
								<Table.Cell className="text-red-600">{problem.name}</Table.Cell>
								<Table.Cell className="text-red-600">
									{problem.difficulty}
								</Table.Cell>
							</Table.Row>
							</Link>
						))}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};

export default Problems;
