// NavbarData

export const NavbarData = [
	{
		id: 1,
		title: "Home",
		path: "/",
		icon: <i className="fas fa-home"></i>,
	},
	{
		id: 2,
		title: "Products",
		path: "/products",
		icon: <i className="fas fa-list"></i>,
	},

	{
		id: 3,
		title: "Today's Offer",
		path: "/offer",
		icon: <i className="fas fa-calendar-alt"></i>,
	},
	{
		id: 5,
		title: "Others",
		path: "/others",
		icon: <i className="fas fa-info-circle"></i>,
		menu: [
			{
				id: 1,
				title: "Join Vendors",
				path: "/vendor",
				icon: <i className="fas fa-user-plus"></i>,
			},
			{
				id: 2,
				title: "Plus User",
				path: "/premium",
				icon: <i className="fas fa-user-plus"></i>,
			},
			{
				id: 3,
				title: "Highlights",
				path: "/highlights",
				icon: <i className="fas fa-info-circle"></i>,
			},
		],
	},

	{
		id: 5,
		title: "Help",
		path: "/help",
		icon: <i className="fas fa-question-circle"></i>,
		menu: [
			{
				id: 1,
				title: "FAQs",
				path: "/faqs",
				icon: <i className="fas fa-question-circle"></i>,
			},
			{
				id: 2,
				title: "Contact Us",
				path: "/contact",
				icon: <i className="fas fa-phone"></i>,
			},
			{
				id: 3,
				title: "About Us",
				path: "/about",
				icon: <i className="fas fa-info-circle"></i>,
			},
			{
				id: 4,
				title: "Terms & Conditions",
				path: "/terms",
				icon: <i className="fas fa-file-alt"></i>,
			},
			{
				id: 5,
				title: "Privacy Policy",
				path: "/privacy",
				icon: <i className="fas fa-user-secret"></i>,
			},
			{
				id: 6,
				title: "Refund Policy",
				path: "/refund",
				icon: <i className="fas fa-undo"></i>,
			},
		],
	},

	{
		id: 6,
		title: "Account",
		path: "/account",
		icon: <i className="fas fa-user"></i>,
		menu: [
			{
				id: 1,
				title: "Profile",
				path: "/profile",
				icon: <i className="fas fa-user"></i>,
			},
			{
				id: 2,
				title: "Orders",
				path: "/orders",
				icon: <i className="fas fa-shopping-bag"></i>,
			},

			{
				id: 4,
				title: "Consult",
				path: "/consult",
				icon: <i className="fas fa-comments"></i>,
			},
			{
				id: 5,
				title: "Logout",
				path: "/logout",
				icon: <i className="fas fa-sign-out-alt"></i>,
			},
		],
		type: "personal",
	},
	{
		id: 7,
		title: "favorites",
		path: "/favorite",
		icon: <i className="fa-regular fa-heart"></i>,
		type: "personal",
	},
	{
		id: 8,
		title: "Cart",
		path: "/cart",
		icon: <i className="fas fa-shopping-cart"></i>,
		type: "personal",
	},
];

// agribusiness
import Stock from "./assets/stock.png";
import Stock1 from "./assets/stock1.png";
import Stock2 from "./assets/stock2.png";
import Stock3 from "./assets/stock3.png";

export const AgribusinessData = [
	{
		id: 1,
		name: "Agrochemicals",
		image: Stock,
		location: "Nairobi",
		description: "Agrochemicals are chemical products used in agriculture.",
	},
	{
		id: 2,
		name: "Agrodealers",
		image: Stock1,
		location: "Nairobi",
		description: "Agrodealers are dealers in agricultural inputs.",
	},
	{
		id: 3,
		name: "Agrovet",
		image: Stock2,
		location: "Nairobi",
		description: "Agrovet is a veterinary pharmacy.",
	},
	{
		id: 4,
		name: "Animal Health",
		image: Stock3,
		location: "Nairobi",
		description: "Animal health is the health of animals.",
	},
	{
		id: 5,
		name: "Animal Feeds",
		image: Stock,
		location: "Nairobi",
		description: "Animal feed is food given to domestic animals.",
	},
	{
		id: 6,
		name: "Animal Feeds",
		image: Stock1,
		location: "Nairobi",
		description: "Animal feed is food given to domestic animals.",
	},
	{
		id: 7,
		name: "Animal Feeds",
		image: Stock2,
		location: "Nairobi",
		description: "Animal feed is food given to domestic animals.",
	},
	{
		id: 8,
		name: "Animal Feeds",
		image: Stock3,
		location: "Nairobi",
		description: "Animal feed is food given to domestic animals.",
	},
];

// banner center data
export const BannerCenterData = [
	{
		id: 1,
		title: "Agrochemicals",
		path: "/agrochemicals",
		image: Stock,
		amount: 100,
		prevAmount: 200,
		category: "Agrochemicals",
		description: "Agrochemicals are chemical products used in agriculture.",
	},
	{
		id: 2,
		title: "Agrodealers",
		path: "/agrodealers",
		image: Stock1,
		amount: 100,
		prevAmount: 200,
		category: "Agrodealers",
		description: "Agrodealers are dealers in agricultural inputs.",
	},
	{
		id: 3,
		title: "Agrovet",
		path: "/agrovet",
		image: Stock2,
		prevAmount: 200,
		amount: 100,
		category: "Agrovet",
		description: "Agrovet is a veterinary pharmacy.",
	},
	{
		id: 4,
		title: "Animal Health",
		path: "/animal-health",
		image: Stock3,
		amount: 100,
		prevAmount: 200,
		category: "Animal Health",
		description: "Animal health is the health of animals.",
	},
	{
		id: 5,
		title: "Animal Feeds",
		path: "/animal-feeds",
		image: Stock,
		amount: 100,
		prevAmount: 200,
		category: "Animal Feeds",
		description: "Animal feeds are feeds for animals.",
	},
];

// agriproffesionals
export const AgriproffesionalsData = [
	{
		id: 1,
		name: "Agronomist",
		image: Stock,
		location: "Nairobi",
		type: "livestock and crops",
		active: true,
		lastActive: "now",
	},
	{
		id: 2,
		name: "Animal Health",
		image: Stock1,
		location: "Nairobi",
		type: "LiveStock",
		active: true,
		lastActive: "now",
	},
	{
		id: 3,
		name: "Animal Feeds",
		image: Stock2,
		location: "Nairobi",
		type: "LiveStock",
		active: false,
		lastActive: "2 hours ago",
	},
	{
		id: 4,
		name: "Crop Production",
		image: Stock3,
		location: "Nairobi",
		type: "Crops",
		active: false,
		lastActive: "2 hours ago",
	},
	{
		id: 5,
		name: "Poultry",
		image: Stock,
		location: "Nairobi",
		type: "Poultry",
		active: false,
		lastActive: "2 hours ago",
	},
	{
		id: 6,
		name: "Animal treatment",
		image: Stock1,
		location: "Nairobi",
		type: "LiveStock",
		active: true,
		lastActive: "now",
	},
];

// banner bottom data
export const BannerBottomData = [
	{
		id: 1,
		title: "Agronomist",
		path: "/agronomist",
		image: Stock,
		amount: 100,
		category: "Agronomist",
	},
	{
		id: 2,
		title: "Animal Health",
		path: "/animal-health",
		image: Stock1,
		amount: 100,
		category: "Animal Health",
	},
	{
		id: 3,
		title: "Animal Feeds",
		path: "/animal-feeds",
		image: Stock2,
		amount: 100,
		category: "Animal Feeds",
	},

	{
		id: 4,
		title: "Crop Production",
		path: "/crop-production",
		image: Stock3,
		amount: 100,
		category: "Crop Production",
	},
	{
		id: 5,
		title: "Poultry",
		path: "/poultry",
		image: Stock,
		amount: 100,
		category: "Poultry",
	},
	{
		id: 6,
		title: "Animal treatment",
		path: "/animal-treatment",
		image: Stock1,
		amount: 100,
		category: "Animal treatment",
	},
	{
		id: 7,
		title: "Agronomist",
		path: "/agronomist",
		image: Stock,
		amount: 100,
		category: "Agronomist",
	},
	{
		id: 8,
		title: "Animal Health",
		path: "/animal-health",
		image: Stock1,
		amount: 100,
		category: "Animal Health",
	},
	{
		id: 9,
		title: "Animal Feeds",
		path: "/animal-feeds",
		image: Stock2,
		amount: 100,
		category: "Animal Feeds",
	},
	{
		id: 10,
		title: "Crop Production",
		path: "/crop-production",
		image: Stock3,
		amount: 100,
		category: "Crop Production",
	},
];

export const CategoriesData = [
	{
		id: 1,
		title: "All",
		path: "/categories",
		image:
			"https://th.bing.com/th/id/OIP.0nY9r2J1a2K5kVvJZzWQVwHaE8?pid=ImgDet&rs=1",
	},
	{
		id: 2,
		title: "Antibiotics",
		path: ".antibiotics",
		image:
			"https://th.bing.com/th/id/R.b8cb8058cfc8c68966a8251729bdfb67?rik=J3UW1%2fyCsbhAKA&riu=http%3a%2f%2focj.com%2fwp-content%2fuploads%2f2012%2f04%2fantibiotics-e1335277645797.jpg&ehk=O13qoopn4%2fgcwfTVRmJpryDCIs5nxu9LNiWaKFUG5W0%3d&risl=&pid=ImgRaw&r=0",
	},
	{
		id: 3,
		title: "Supplements",
		path: ".supplements",
		image:
			"https://th.bing.com/th/id/R.6820786d70bc3a2916f44900435e7ad3?rik=4%2bvORsINLEHByQ&pid=ImgRaw&r=0&sres=1&sresct=1",
	},
	{
		id: 4,
		title: "Injectables",
		path: ".injectables",
		image:
			"https://th.bing.com/th/id/OIP.yKE_yVuM6pT5rD1RY4NxxgAAAA?rs=1&pid=ImgDetMain",
	},
	{
		id: 5,
		title: "Wormers",
		path: ".wormers",
		image:
			"https://th.bing.com/th/id/R.ab2a45cd1701ebbbdf4cb04c7abf4fd0?rik=X1R%2bF%2bJpSCX%2fww&pid=ImgRaw&r=0",
	},

	{
		id: 7,
		title: "Antiinflammatory",
		path: ".anti-Inflammatory",
		image:
			"https://th.bing.com/th/id/OIP.yJspT_w1DNSwc_9a4XUy3QAAAA?rs=1&pid=ImgDetMain",
	},
	{
		id: 9,
		title: "Anesthetics",
		path: ".anesthetics",
		image: "https://www.farmandpetplace.co.uk/shop/gallery/00037724.JPG",
	},
	{
		id: 10,
		title: "Nutrition",
		path: ".nutrition",
		image:
			"https://img.favpng.com/25/15/6/cattle-feeding-animal-feed-fodder-pelletizing-png-favpng-3R9dFuV2rxFLYWAug43JsA2xM.jpg",
	},
];

// ProfileLeft Data
export const profileLeftData = [
	{
		id: 1,
		title: "My Account",
		icon: <i className="fas fa-user"></i>,
	},
	{
		id: 2,
		title: "Notifications",
		icon: <i className="fas fa-bell"></i>,
	},
	{
		id: 2,
		title: "My Orders",
		icon: <i className="fas fa-shopping-bag"></i>,
	},
	{
		id: 3,
		title: "Consults",
		icon: <i className="fas fa-comment-alt"></i>,
	},
	{
		id: 4,
		title: "My Cart",
		icon: <i className="fas fa-shopping-cart"></i>,
	},
	{
		id: 5,
		title: "Settings",
		icon: <i className="fas fa-cog"></i>,
	},
];

// OrderCategory
export const orderCategory = [
	{
		id: 1,
		title: "All",
	},
	{
		id: 2,
		title: "Pending",
	},
	{
		id: 3,
		title: "Delivered",
	},
	{
		id: 4,
		title: "Cancelled",
	},
];

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


// faq data
export const faqData = {
	faqs: [
		{
			id: 1,
			user: "user123",
			question: "What payment methods do you accept?",
			timestamp: "2024-04-15T08:30:00Z",
			category: "Payment",
			status: "Answered",
			responses: [
				{
					id: 101,
					user: "supportAgent1",
					timestamp: "2024-04-16T09:15:00Z",
					response: "We accept credit cards, PayPal, and bank transfers.",
					status: "Official",
				},
				{
					id: 102,
					user: "user123",
					timestamp: "2024-04-16T10:00:00Z",
					response: "Thank you for the clarification!",
					status: "User Acknowledgment",
				},
			],
		},
		{
			id: 2,
			user: "user456",
			question: "How long does shipping take?",
			timestamp: "2024-04-17T10:00:00Z",
			category: "Shipping",
			status: "Answered",
			responses: [
				{
					id: 201,
					user: "supportAgent2",
					timestamp: "2024-04-18T11:00:00Z",
					response: "Shipping usually takes 3-5 business days.",
					status: "Official",
				},
			],
		},
		{
			id: 3,
			user: "user789",
			question: "Do you ship internationally?",
			timestamp: "2024-04-20T12:45:00Z",
			category: "Shipping",
			status: "Answered",
			responses: [
				{
					id: 301,
					user: "supportAgent3",
					timestamp: "2024-04-21T13:30:00Z",
					response:
						"Yes, we ship to over 100 countries worldwide. Additional shipping charges may apply.",
					status: "Official",
				},
			],
		},
	],
};
