import React from "react";
import { Badge, Button, MenuItem, Switch, TextField } from "@mui/material";
import PropTypes from "prop-types";
import PasswordDetails from "../PasswordDetails/PasswordDetails";

const AccountInfoRight = ({
	accountInfo,
	edit,
	handleEdit,
	handleSave,
	handleToggleEdit,
}) => {
	return (
		<div className="AccountInfoRight">
			<h4>Account Details</h4>
			<div className="AccountInfoItem">
				<TextField
					label="Name"
					variant="outlined"
					value={accountInfo.name}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, name: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
				<TextField
					label="Email"
					variant="outlined"
					value={accountInfo.email}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, email: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
			</div>
			<div className="AccountInfoItem">
				<TextField
					label="Phone"
					variant="outlined"
					value={accountInfo.phone}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, phone: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
				<TextField
					label="Username"
					variant="outlined"
					value={accountInfo.username}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, username: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
			</div>
			<div className="AccountInfoItem">
				<TextField
					label="Address"
					variant="outlined"
					value={accountInfo.address}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, address: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
				<TextField
					label="User Type"
					variant="outlined"
					value={accountInfo.userType}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, city: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
					select
					defaultValue={accountInfo.userType}
				>
					<MenuItem value="agriprofessional">Agriprofessional</MenuItem>
					<MenuItem value="agribusiness">Agribusiness</MenuItem>
					<MenuItem value="farmer">Farmer</MenuItem>
				</TextField>
			</div>
			<div className="AccountInfoItem">
				<TextField
					label="Business Name"
					variant="outlined"
					value={accountInfo.businessName}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, state: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
				<TextField
					label="Business Location"
					variant="outlined"
					value={accountInfo.businessLocation}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, country: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
				/>
			</div>
			<div className="AccountInfoItem">
				<TextField
					label="Business Description"
					variant="outlined"
					value={accountInfo.businessDescription}
					disabled={edit}
					onChange={(e) =>
						setAccountInfo({ ...accountInfo, country: e.target.value })
					}
					color="success"
					fullWidth
					size="small"
					multiline
					rows={4}
				/>
			</div>
			<div className="ChangeBtn">
				{edit ? (
					<>
						<Button className="SaveChanges" onClick={handleSave}>
							Save Changes
						</Button>
						<Button className="CancelChanges" onClick={() => setEdit(false)}>
							Cancel
						</Button>
					</>
				) : (
					<Button className="EditProfile" onClick={() => setEdit(true)}>
						Edit Profile
					</Button>
				)}
			</div>
			<PasswordDetails
				edit={edit}
				handleEdit={handleEdit}
				handleSave={handleSave}
				handleToggleEdit={handleToggleEdit}
			/>
		</div>
	);
};

export default AccountInfoRight;

// props validation
AccountInfoRight.propTypes = {
	accountInfo: PropTypes.object.isRequired,
	edit: PropTypes.bool.isRequired,
	handleEdit: PropTypes.func.isRequired,
	handleSave: PropTypes.func.isRequired,
	handleToggleEdit: PropTypes.func.isRequired,
};
