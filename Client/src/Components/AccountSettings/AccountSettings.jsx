import { useContext, useState, useEffect } from "react";
import "./AccountSettings.css";
import axios from "axios";
import { Switch, styled, Snackbar, Alert } from "@mui/material";
import { ApiContext } from "../../Context/ApiProvider";

const IOSSwitch = styled((props) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
	width: 36,
	height: 20,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 1,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#33cf4d",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color:
				theme.palette.mode === "light"
					? theme.palette.grey[100]
					: theme.palette.grey[600],
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 18,
		height: 18,
	},
	"& .MuiSwitch-track": {
		borderRadius: 20 / 2,
		backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
		opacity: 1,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

const SettingItem = ({ label, description, checked, onChange }) => (
	<div className="SettingsItem">
		<div className="SettingsItemLeft">
			<IOSSwitch
				checked={checked}
				onChange={onChange}
				name={label}
				color="primary"
			/>
		</div>
		<div className="SettingsItemRight">
			<span>{label}</span>
			<p>{description}</p>
		</div>
	</div>
);

const AccountSettings = () => {
	const { settingsData, userData } = useContext(ApiContext);

	const [settings, setSettings] = useState({
		personalizedEmails: false,
		news: false,
		updates: false,
		reminders: false,
		pushReminders: false,
		pushActivity: false,
		newsletters: false,
		newProducts: false,
		theme: "light",
		cookieUsage: false,
	});

	useEffect(() => {
		if (settingsData) {
			setSettings({
				personalizedEmails: settingsData.personalizedEmails,
				news: settingsData.news,
				updates: settingsData.updates,
				reminders: settingsData.reminders,
				pushReminders: settingsData.pushReminders,
				pushActivity: settingsData.pushActivity,
				newsletters: settingsData.newsLetter,
				newProducts: settingsData.newProduct,
				theme: settingsData.theme,
				cookieUsage: settingsData.cookies,
			});
		}
	}, [settingsData]);

	const handleSwitchChange = (event) => {
		const { name, checked } = event.target;
		setSettings((prevSettings) => ({
			...prevSettings,
			[name]: checked,
		}));
	};

	const saveSettings = async () => {
		try {
			if (userData) {
				await axios.patch(
					`http://localhost:8000/settings/${userData._id}`,
					settings,
					{
						headers: {
							"x-auth-token": userData.token,
						},
					}
				);
			}
		} catch (error) {
			console.error("Error saving settings:", error);
		}
	};

	useEffect(() => {
		saveSettings();
	}, [settings]);

	// alert message for saving settings
	const [open, setOpen] = useState(false);
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		setOpen(true);
	}, [settings]);

	return (
		<div className="AccountSettings">
			<h3>Account Settings</h3>
			<div className="AccSetting">
				<h3>Notifications</h3>
				<p>
					Get emails about your account activity, security notifications, and
					product updates. You can always change the settings anytime.
				</p>
				<SettingItem
					label="personalizedEmails"
					description="Receive emails about your account activity, security notifications, and product updates."
					checked={settings.personalizedEmails}
					onChange={handleSwitchChange}
				/>
				<SettingItem
					label="news"
					description="Receive emails about news from the company and the industry."
					checked={settings.news}
					onChange={handleSwitchChange}
				/>
				<SettingItem
					label="updates"
					description="Feature updates."
					checked={settings.updates}
					onChange={handleSwitchChange}
				/>
				<SettingItem
					label="reminders"
					description="Reminders of your payments, orders, and other important activities."
					checked={settings.reminders}
					onChange={handleSwitchChange}
				/>
			</div>
			<div className="AccSetting">
				<h3>Push Notifications</h3>
				<p>
					Get push notifications about your account activity, security updates,
					and product updates. You can always change the settings anytime.
				</p>
				<SettingItem
					label="pushReminders"
					description="These are the notifications to remind you of the updates you might have missed."
					checked={settings.pushReminders}
					onChange={handleSwitchChange}
				/>
				<SettingItem
					label="pushActivity"
					description="Receive push notifications about news from the company and the industry."
					checked={settings.pushActivity}
					onChange={handleSwitchChange}
				/>
			</div>
			<div className="AccSetting">
				<h3>Communication Preferences</h3>
				<p>
					Choose how you want to receive messages from us. You can always change
					the settings anytime.
				</p>
				<SettingItem
					label="newsletters"
					description="Receive newsletters from us."
					checked={settings.newsletters}
					onChange={handleSwitchChange}
				/>
				<SettingItem
					label="newProducts"
					description="Receive emails about new products, discounts, and promotions from us."
					checked={settings.newProducts}
					onChange={handleSwitchChange}
				/>
			</div>
			<div className="AccSetting">
				<h3>Themes and Other Settings</h3>
				<p>Choose your theme and other settings.</p>
				<SettingItem
					label="theme"
					description="Dark"
					checked={settings.theme === "dark"}
					onChange={(event) =>
						handleSwitchChange({
							target: {
								name: "theme",
								checked: event.target.checked ? "dark" : "light",
							},
						})
					}
				/>
				<SettingItem
					label="cookieUsage"
					description="Allow cookie usage."
					checked={settings.cookieUsage}
					onChange={handleSwitchChange}
				/>
			</div>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
					Settings updated successfully!
				</Alert>
			</Snackbar>
		</div>
	);
};

export default AccountSettings;
