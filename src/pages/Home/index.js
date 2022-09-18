import Tabs from "@/components/Tabs";
import { useState } from "react";
import styles from "./index.module.scss";

const TestTabContent = ({ label, aid }) => {
	return (
		<div>
			{label}-{aid}
		</div>
	);
};

const Home = () => {
	const tabs = [
		{ id: 1, name: "频道1" },
		{ id: 2, name: "频道2" },
		{ id: 3, name: "频道3" },
		{ id: 4, name: "频道4" },
		{ id: 5, name: "频道5" },
		{ id: 6, name: "频道6" },
		{ id: 7, name: "频道7" },
		{ id: 8, name: "频道8" },
		{ id: 9, name: "频道9" },
		{ id: 10, name: "频道10" },
	];

	const [tabActiveIndex, setTabActiveIndex] = useState(0);

	return (
		<div className={styles.root}>
			<Tabs
				tabs={tabs}
				index={tabActiveIndex}
				onChange={(i) => setTabActiveIndex(i)}
			>
				{tabs.map((item) => {
					return <TestTabContent key={item.id} label={item.name} />;
				})}
			</Tabs>
		</div>
	);
};

export default Home;
