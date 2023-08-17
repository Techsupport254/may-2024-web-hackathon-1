import React from "react";

const MaskedImage = ({ imageUrl, maskId }) => {
	return (
		<svg
			viewBox="0 0 100 100" // Set the viewBox based on your desired image size
			width="100"
			height="100"
		>
			<mask id={maskId}>
				{/* Define your masking shape here, e.g., a circle */}
				<circle cx="50" cy="50" r="45" fill="white" />
			</mask>
			<image
				x="0"
				y="0"
				width="100"
				height="100"
				href={imageUrl}
				mask={`url(#${maskId})`}
			/>
		</svg>
	);
};

export default MaskedImage;
