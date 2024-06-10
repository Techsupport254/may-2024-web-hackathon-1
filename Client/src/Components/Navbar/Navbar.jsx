import { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import Logo from "../../Assets/logo.png";
import { Link } from "react-router-dom";
import { NavbarData } from "../../Data";
import Badge from "@mui/material/Badge";
import { Menu, Dropdown } from "antd";
import { InputAdornment, TextField } from "@mui/material";
import { ApiContext } from "../../Context/ApiProvider";

const Navbar = () => {
	const { userData, handleLogout, cartItems, pendingOrders } =
		useContext(ApiContext);

	const [searching, setSearching] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const handleMenuToggle = (e) => {
		e.preventDefault();
		setMenuVisible((prevVisible) => !prevVisible);
	};

	const handleSearchToggle = (e) => {
		e.preventDefault();
		setSearching((prevVisible) => !prevVisible);
	};

	const personalItems = NavbarData?.filter((item) => item.type === "personal");
	const commonItems = NavbarData?.filter((item) => !item.type);

	return (
		<div className="Navbar">
			<div className="NavbarContainer">
				<div className="NavbarLogo">
					<Link to="/">
						<img src={Logo} alt="logo" />
						<span>
							Agri<p>solve</p>
						</span>
					</Link>
				</div>
				<div className="NavLeft">
					<div className="Searchbar">
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
					</div>
					<div className="NavbarLinks">
						{commonItems?.map((item, index) => (
							<div className="NavItem" key={index}>
								{item.menu ? (
									<Dropdown
										overlay={
											<Menu>
												{item.menu.map((subItem, index) => (
													<Menu.Item key={index}>
														<Link
															to={subItem.path}
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
														</Link>
													</Menu.Item>
												))}
											</Menu>
										}
										placement="bottomCenter"
										trigger={["click"]}
										arrow
									>
										<Link to={item.path} onClick={handleMenuToggle}>
											{item.icon}
											{item.title}
											<i className="fas fa-caret-down"></i>
										</Link>
									</Dropdown>
								) : (
									<Link to={item.path}>
										{item.icon}
										{item.title}
									</Link>
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
																	<Link
																		to={subItem.path}
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
																	</Link>
																)}
															</Menu.Item>
														))}
													</Menu>
												}
												placement="bottomCenter"
												trigger={["click"]}
												arrow
											>
												<Link
													to={item.path}
													onClick={(e) => {
														e.preventDefault();
														handleMenuToggle(e);
													}}
												>
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
															style={{
																fontSize: "30px",
															}}
														></i>
													)}
													{userData?.username}
													<i className="fas fa-caret-down"></i>
												</Link>
											</Dropdown>
										) : (
											<Link to={item.path}>
												{item.icon}
												{item.title}
											</Link>
										)}
									</div>
								);
							} else {
								return (
									<div className="NavItem" key={index}>
										<Link to={item.path}>
											{item.icon}
											{item.title === "Cart" && cartItems?.length !== 0 && (
												<Badge
													badgeContent={cartItems?.length}
													color="success"
												/>
											)}
										</Link>
									</div>
								);
							}
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
