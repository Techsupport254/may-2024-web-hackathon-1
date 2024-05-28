// Fetch random user data from Random User Generator API
export const fetchRandomUserData = async (numberOfResults) => {
	try {
		const response = await fetch(
			`https://randomuser.me/api/?results=${numberOfResults}`
		);
		const data = await response.json();
		return data.results;
	} catch (error) {
		console.error("Error fetching random user data:", error);
		return [];
	}
};

// Function to generate random rating between 1 and 5
export const generateRandomRating = () => Math.floor(Math.random() * 5) + 1;
