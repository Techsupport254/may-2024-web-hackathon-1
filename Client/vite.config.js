import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	plugins: [react()],
	define: {
		__CLOUD_NAME__: JSON.stringify(process.env.CLOUD_NAME),
		__UPLOAD_PRESET__: JSON.stringify(process.env.UPLOAD_PRESET),
	},
});
