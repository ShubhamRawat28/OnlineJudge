import React from "react";
import NavbarComponent from "./NavbarComponent";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
 
const content = [
  {
    title: "Problems",
    description:
      "Solve a wide range of coding challenges designed to test and improve your problem-solving skills. From easy to hard, our platform offers problems for every level. Get real-time feedback on your solutions and track your progress over time.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--blue-500),var(--indigo-500))] flex items-center justify-center text-white">
        Problems
      </div>
    ),
  },
  {
    title: "Learning Materials",
    description:
      "Access a variety of learning materials to help you master new concepts and techniques. Our platform offers tutorials, articles, and videos to support your learning journey. Stay up-to-date with the latest in technology and enhance your skills.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        Learning Materials
      </div>
    ),
  },
  {
    title: "Data Structures and Algorithms (DSA)",
    description:
      "Deepen your understanding of data structures and algorithms with our comprehensive DSA section. Learn the theory, see practical examples, and solve related problems to reinforce your knowledge. Stay ahead in competitive programming and technical interviews.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--red-500),var(--yellow-500))] flex items-center justify-center text-white">
        Data Structures and Algorithms
      </div>
    ),
  },
  {
    title: "Development",
    description:
      "Enhance your development skills with our hands-on projects and tutorials. Our platform offers resources on web development, mobile development, and more. Build real-world applications and showcase your work to potential employers.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--green-500),var(--teal-500))] flex items-center justify-center text-white">
        Development
      </div>
    ),
  },
];


const Home = () => {
	return (
		<div>
		<NavbarComponent />
		<StickyScroll content={content} className="h-full" />
		</div>
	);
};

export default Home;
