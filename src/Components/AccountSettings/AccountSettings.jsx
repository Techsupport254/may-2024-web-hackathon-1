import React, { useState } from "react";
import "./AccountSettings.css";

const AccountSettings = () => {
	const [account, setAccount] = useState({
		id: 1,
		firstName: "John",
		lastName: "Doe",
		email: "kiruivictor097@gmail.com",
		phone: "0700000000",
	});
	const [twoFactorAuth, setTwoFactorAuth] = useState(false);
	const [privacySettings, setPrivacySettings] = useState({
		dataSharing: true,
		cookieUsage: true,
	});
	const [newsletterSubscriptions, setNewsletterSubscriptions] = useState(true);
	const [marketingPreferences, setMarketingPreferences] = useState({
		promotion: true,
		newProducts: true,
	});
	const [selectedTheme, setSelectedTheme] = useState("default");

	const handleTwoFactorAuthToggle = () => {
		setTwoFactorAuth((prevValue) => !prevValue);
	};

	const handlePrivacySettingsChange = (event) => {
		const { name, checked } = event.target;
		setPrivacySettings((prevSettings) => ({
			...prevSettings,
			[name]: checked,
		}));
	};

	const handleNewsletterSubscriptionsChange = () => {
		setNewsletterSubscriptions((prevValue) => !prevValue);
	};

	const handleMarketingPreferencesChange = (event) => {
		const { name, checked } = event.target;
		setMarketingPreferences((prevPreferences) => ({
			...prevPreferences,
			[name]: checked,
		}));
	};

	const handleThemeChange = (event) => {
		setSelectedTheme(event.target.value);
	};

	return (
		<div className="AccountSettings">
			<div className="AccSetting">
				<h3>Security and Privacy</h3>
				<div className="SettingsItem">
					<label>
						Two-Factor Authentication:
						<input
							type="checkbox"
							checked={twoFactorAuth}
							onChange={handleTwoFactorAuthToggle}
						/>
					</label>
				</div>

				<div className="SettingsItem">
					<label>
						Data Sharing:
						<input
							type="checkbox"
							name="dataSharing"
							checked={privacySettings.dataSharing}
							onChange={handlePrivacySettingsChange}
						/>
					</label>
				</div>
				<div className="SettingsItem">
					<label>
						Cookie Usage:
						<input
							type="checkbox"
							name="cookieUsage"
							checked={privacySettings.cookieUsage}
							onChange={handlePrivacySettingsChange}
						/>
					</label>
				</div>
			</div>
			<div className="AccSetting">
				<h3>Communication Preferences</h3>
				<div className="SettingsItem">
					<label>
						Newsletter Subscriptions:
						<input
							type="checkbox"
							checked={newsletterSubscriptions}
							onChange={handleNewsletterSubscriptionsChange}
						/>
					</label>
				</div>
				<div className="SettingsItem">
					<label>
						Promotions:
						<input
							type="checkbox"
							name="promotion"
							checked={marketingPreferences.promotion}
							onChange={handleMarketingPreferencesChange}
						/>
					</label>
				</div>
				<div className="SettingsItem">
					<label>
						New Products:
						<input
							type="checkbox"
							name="newProducts"
							checked={marketingPreferences.newProducts}
							onChange={handleMarketingPreferencesChange}
						/>
					</label>
				</div>
			</div>
			<div className="AccSetting">
				<h3>Themes and Other Settings</h3>
				<div className="SettingsItem">
					<label>
						Select Theme:
						<select value={selectedTheme} onChange={handleThemeChange}>
							<option value="default">Default</option>
							<option value="dark">Dark</option>
							<option value="light">Light</option>
						</select>
					</label>
				</div>
			</div>
			<div className="DeleteAccount">
				<div className="AccountInfo">
					<span>
						{account.firstName} {account.lastName}
					</span>
					<p>{account.email}</p>
					<p>{account.phone}</p>
					<button className="DeleteAccountBtn">
						<i className="fas fa-trash"></i>
						Account
					</button>
				</div>
			</div>
		</div>
	);
};

export default AccountSettings;
