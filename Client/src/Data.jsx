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
		title: "Cart",
		path: "/cart",
		icon: <i className="fas fa-shopping-cart"></i>,
	},
	{
		id: 4,
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
		id: 5,
		title: "Consult",
		path: "/consult",
		icon: <i className="fas fa-comments"></i>,
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
				id: 3,
				title: "Logout",
				path: "/logout",
				icon: <i className="fas fa-sign-out-alt"></i>,
			},
		],
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
	},
	{
		id: 2,
		title: "Antibiotics",
		path: ".antibiotics",
	},
	{
		id: 3,
		title: "Supplements",
		path: ".supplements",
	},
	{
		id: 4,
		title: "Injectables",
		path: ".injectables",
	},
	{
		id: 5,
		title: "Wormers",
		path: ".wormers",
	},
	{
		id: 6,
		title: "Anabolic",
		path: ".anabolic",
	},
	{
		id: 7,
		title: "Antiinflammatory",
		path: ".anti-Inflammatory",
	},
	{
		id: 8,
		title: "Hormonal",
		path: ".hormonal",
	},
	{
		id: 9,
		title: "Anesthetics",
		path: ".anesthetics",
	},
	{
		id: 10,
		title: "Nutrition",
		path: ".nutrition",
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
