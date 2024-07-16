import { useState, useContext } from "react";
import "./Navbar.css";
import { NavbarData } from "../../Data";
import Badge from "@mui/material/Badge";
import { Menu, Dropdown } from "antd";
import { InputAdornment, Modal, TextField } from "@mui/material";
import { ApiContext } from "../../Context/ApiProvider";
import axios from "axios"; // Import axios to make HTTP requests

const Navbar = () => {
	const { userData, handleLogout, cartItems, pendingOrders } =
		useContext(ApiContext);

	const [searching, setSearching] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [menuVisible, setMenuVisible] = useState(false);
	const [searchResults, setSearchResults] = useState([]); // State to hold search results

	const handleMenuToggle = () => {
		setMenuVisible((prevVisible) => !prevVisible);
	};

	const handleSearchToggle = async (e) => {
		e.preventDefault();
		setSearching((prevVisible) => !prevVisible);

		if (searchInput) {
			try {
				// Make a GET request to the search endpoint with the search query
				const response = await axios.get(
					`http://localhost:8000/search/products?query=${searchInput}`
				);
				// Update the search results state with the response data
				setSearchResults(response.data);
			} catch (error) {
				console.error("Error searching for products:", error);
			}
		}

		setSearchInput("");
	};

	const personalItems = NavbarData?.filter((item) => item.type === "personal");
	const commonItems = NavbarData?.filter((item) => !item.type);

	const navigateTo = (path) => {
		window.location.href = path;
	};

	return (
		<div className="Navbar">
			<div className="NavbarContainer">
				<div className="NavbarLogo">
					<a
						href="/"
						onClick={(e) => {
							e.preventDefault();
							navigateTo("/");
						}}
					>
						<img
							src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png"
							alt="logo"
						/>
						<span>
							Agri<p>solve</p>
						</span>
					</a>
					{window.innerWidth < 768 && (
						<i
							className="fa fa-search"
							style={{
								color: "var(--success-darker)",
								fontSize: "1.2rem",
								cursor: "pointer",
							}}
							onClick={handleSearchToggle}
						></i>
					)}
				</div>
				<div className={`NavLeft ${menuVisible ? "active" : ""}`}>
					<div className="Searchbar">
						{window.innerWidth > 768 && (
							<form onSubmit={handleSearchToggle}>
								<TextField
									placeholder="Search for products ..."
									size="small"
									color="success"
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{searching ? (
													<i
														className="fas fa-circle-notch fa-spin"
														style={{
															color: "var(--success-darker)",
															fontSize: "1.2rem",
															cursor: "pointer",
														}}
													></i>
												) : (
													<i
														className="fa fa-search"
														style={{
															color: "var(--success-darker)",
															fontSize: "1.2rem",
															cursor: "pointer",
														}}
													></i>
												)}
											</InputAdornment>
										),
									}}
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									style={{
										cursor: "pointer",
										padding: "0",
										margin: "0",
									}}
								/>
							</form>
						)}
					</div>
					<div className="NavbarLinks NavMobile">
						{commonItems?.map((item, index) => (
							<div className="NavItem" key={index}>
								{item.menu ? (
									<Dropdown
										overlay={
											<Menu>
												{item.menu.map((subItem, index) => (
													<Menu.Item key={index}>
														<a
															href={subItem.path}
															onClick={(e) => {
																e.preventDefault();
																navigateTo(subItem.path);
															}}
															style={{
																display: "flex",
																gap: "10px",
															}}
														>
															<div
																className="subItemIcon"
																style={{ color: "green" }}
															>
																{subItem.icon}
															</div>
															{subItem.title}
														</a>
													</Menu.Item>
												))}
											</Menu>
										}
										placement="bottomCenter"
										trigger={["click"]}
										arrow
									>
										<a href={item.path} onClick={(e) => e.preventDefault()}>
											{item.icon}
											{item.title}
											<i className="fas fa-caret-down"></i>
										</a>
									</Dropdown>
								) : (
									<a
										href={item.path}
										onClick={(e) => {
											e.preventDefault();
											navigateTo(item.path);
										}}
									>
										{item.icon}
										{item.title}
									</a>
								)}
							</div>
						))}
					</div>
				</div>
				<div className="NavRight">
					<div className="NavbarLinks">
						{personalItems?.map((item, index) => {
							if (item.title === "Account") {
								return (
									<div className="NavItem" key={index}>
										{userData ? (
											<Dropdown
												overlay={
													<Menu>
														{item.menu.map((subItem, index) => (
															<Menu.Item key={index}>
																{subItem.title === "Logout" ? (
																	<div
																		style={{
																			display: "flex",
																			gap: "10px",
																			borderTop: "1px solid #777",
																		}}
																		onClick={handleLogout}
																	>
																		<div
																			className="subItemIcon"
																			style={{ color: "green" }}
																		>
																			{subItem.icon}
																		</div>
																		<div className="subItemTitle">
																			{subItem.title}
																		</div>
																	</div>
																) : (
																	<a
																		href={subItem.path}
																		onClick={(e) => {
																			e.preventDefault();
																			navigateTo(subItem.path);
																		}}
																		style={{
																			display: "flex",
																			gap: "10px",
																			alignItems: "center",
																		}}
																	>
																		<div
																			className="subItemIcon"
																			style={{ color: "green" }}
																		>
																			{subItem.icon}
																		</div>
																		<div className="subItemTitle">
																			{subItem.title}
																		</div>
																		{subItem.title === "Cart" &&
																			cartItems?.length !== 0 && (
																				<Badge
																					badgeContent={cartItems?.length}
																					color="success"
																				/>
																			)}
																		{subItem.title === "Orders" &&
																			pendingOrders.length !== 0 && (
																				<Badge variant="dot" color="success" />
																			)}
																	</a>
																)}
															</Menu.Item>
														))}
													</Menu>
												}
												placement="bottomCenter"
												trigger={["click"]}
												arrow
											>
												<a href={item.path} onClick={(e) => e.preventDefault()}>
													{userData?.profilePicture ? (
														<img
															src={
																userData?.profilePicture
																	? userData?.profilePicture
																	: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
															}
															style={{
																width: "30px",
																height: "30px",
																borderRadius: "50%",
																objectFit: "cover",
															}}
															alt={userData?.name}
														/>
													) : (
														<i
															className="fas fa-user-circle"
															style={{ fontSize: "30px" }}
														></i>
													)}
													{userData?.username}
													<i className="fas fa-caret-down"></i>
												</a>
											</Dropdown>
										) : (
											<a
												href={item.path}
												onClick={(e) => {
													e.preventDefault();
													navigateTo(item.path);
												}}
											>
												{item.icon}
												{item.title}
											</a>
										)}
									</div>
								);
							} else {
								return (
									<div className="NavItem" key={index}>
										<a
											href={item.path}
											onClick={(e) => {
												e.preventDefault();
												navigateTo(item.path);
											}}
										>
											{item.icon}
											{item.title === "Cart" && cartItems?.length !== 0 && (
												<Badge
													badgeContent={cartItems?.length}
													color="success"
												/>
											)}
										</a>
									</div>
								);
							}
						})}
					</div>
					<div className="MenuToggler">
						<i
							className={menuVisible ? "fas fa-times" : "fas fa-bars"}
							onClick={handleMenuToggle}
							style={{
								fontSize: "1.5rem",
								cursor: "pointer",
							}}
						></i>
					</div>
				</div>
			</div>
			{/* Display search results */}
			{searchResults.length > 0 ? (
				<Modal
					open={searching}
					onClose={() => setSearching(false)}
					aria-labelledby="search-results"
					aria-describedby="search-results"
				>
					<div className="SearchResults">
						<ul>
							{searchResults.map((product) => (
								<li
									key={product._id}
									onClick={() => {
										navigateTo(`/product/${product._id}`);
										setSearching(false);
									}}
								>
									<img src={product?.images[0]} alt="" />
									<div className="ResultsDetails">
										<h4>{product?.productName}</h4>
										<p>{product?.productDescription}</p>
										<p>Category: {product?.productCategory}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</Modal>
			) : (
				<Modal
					open={searching}
					onClose={() => setSearching(false)}
					aria-labelledby="search-results"
					aria-describedby="search-results"
				>
					<div className="SearchResults NoResults">
						<p>No results found</p>
					</div>
				</Modal>
			)
			}
		</div>
	);
};

export default Navbar;
