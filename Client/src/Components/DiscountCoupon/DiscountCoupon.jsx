import { Button, InputAdornment, TextField } from "@mui/material";
import "./DiscountCoupon.css";

const DiscountCoupon = () => {
	return (
		<div className="DiscountCoupon">
			<TextField
				placeholder="Discount Coupon"
				size="small"
				className="DiscountCouponInput"
				fullWidth
				sx={{
					padding: "0",
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<Button
								size="small"
								style={{
									backgroundColor: "var(--primary)",
									color: "white",
									fontSize: ".8rem",
									width: "2rem",
									height: "1.5rem",
									textTransform: "none",
								}}
								variant="contained"
							>
								Apply
							</Button>
						</InputAdornment>
					),
				}}
			/>
		</div>
	);
};

export default DiscountCoupon;
