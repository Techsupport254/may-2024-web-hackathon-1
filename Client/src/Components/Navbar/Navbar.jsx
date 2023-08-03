import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Logo from "../../Assets/Logo.png";
import { Link } from "react-router-dom";
import { NavbarData } from "../../Data";
import Badge from "@mui/material/Badge";
import { Menu, Dropdown } from "antd";

const Navbar = ({ userData, handleLogout }) => {
	const [user, setUser] = useState(null);

	// fetch cart data from local storage
	const cartItems = JSON.parse(localStorage.getItem("cart"));
	const cartCount = cartItems?.length;
	const cartItemsCount = cartCount ? cartCount : 0;

	useEffect(() => {
		setUser(userData);
	}, [userData]);

	const handleMenuToggle = (e) => {
		e.preventDefault();
		setMenuVisible((prevVisible) => !prevVisible);
	};

	return (
		<div className="Navbar">
			<div className="NavbarContainer">
				<div className="NavbarLogo">
					<Link to="/">
						<img src={Logo} alt="logo" />
						<span>Agrisolve</span>
					</Link>
				</div>
				<div className="NavRight">
					<div className="NavTop">
						<div className="Searchbar">
							<input type="text" placeholder="Search" />
							<button>
								<i className="fas fa-search"></i>
							</button>
						</div>
						<div className="NavbarLinks">
							{NavbarData.map((item, index) => {
								if (item.title === "Cart") {
									return (
										<div className="NavItem" key={index}>
											<Link to={item.path}>
												<Badge badgeContent={cartItemsCount} color="primary">
													<i className="fas fa-shopping-cart"></i>
												</Badge>
												{item.title}
											</Link>
										</div>
									);
								} else if (item.title === "Account") {
									return (
										<div className="NavItem" key={index}>
											{user && user.loginStatus === "loggedIn" ? (
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
														{user.profilePicture ? (
															<img
																src={
																	user.profilePicture
																		? user.profilePicture
																		: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
																}
																style={{
																	width: "30px",
																	height: "30px",
																	borderRadius: "50%",
																	objectFit: "cover",
																}}
																alt={user.name}
															/>
														) : (
															<i
																className="fas fa-user-circle"
																style={{
																	fontSize: "30px",
																}}
															></i>
														)}

														{user.username}
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
									);
								}
							})}
						</div>
					</div>
					<div className="NavBottom"></div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
