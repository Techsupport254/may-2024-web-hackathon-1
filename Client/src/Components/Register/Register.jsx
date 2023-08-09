import React, { useEffect, useState } from "react";
import { Stepper, Step, StepLabel, StepButton } from "@mui/material";
import "./Register.css";
import { Link } from "react-router-dom";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const Register = () => {
	const [activeStep, setActiveStep] = useState(0);

	const handleStepClick = (step) => {
		setActiveStep(step);
	};

	const handleNextStep = () => {
		setActiveStep((prevStep) => prevStep + 1);
	};

	// fetch formData from localStorage
	const formData = JSON.parse(localStorage.getItem("formData"));
	console.log(formData);

	return (
		<div className="Register">
			<div className="RegisterContainer">
				<div className="RegisterLeft">
					<div className="RegisterCont">
						<Stepper
							activeStep={activeStep}
							alternativeLabel
							sx={{
								width: "100%",
							}}
						>
							<Step
								sx={{
									width: "100%",
									"& .MuiStepButton-root.Mui-active": {
										backgroundColor: "green",
										"& .MuiStepButton-label": {
											color: "#fff",
										},
									},
								}}
							>
								<StepButton onClick={() => handleStepClick(0)}>
									Register
								</StepButton>
							</Step>
							<Step>
								<StepButton onClick={() => handleStepClick(1)}>
									More details
								</StepButton>
							</Step>
							<Step>
								<StepButton onClick={() => handleStepClick(2)}>
									Summary
								</StepButton>
							</Step>
						</Stepper>
						{activeStep === 0 && <Step0 onNextStep={handleNextStep} />}
						{activeStep === 1 && (
							<Step1
								onNextStep={handleNextStep}
								userType={formData.userType}
								activeStep={activeStep}
								setActiveStep={setActiveStep}
							/>
						)}
						{activeStep === 2 && <Step2 onNextStep={handleNextStep} />}
						{activeStep === 3 && <Step3 />}
					</div>
					{activeStep !== 3 && (
						<div className="BottomReg">
							<p>
								By finishing registration, you agree to our{" "}
								<span>
									<Link to="/terms">Terms and Conditions</Link>
								</span>{" "}
								and{" "}
								<span>
									<Link to="/privacy">Privacy Policy</Link>
								</span>
							</p>
							<p>
								Already have an account?
								<span>
									<Link to="/login">Login</Link>
								</span>
							</p>
						</div>
					)}
				</div>
				<div className="RegisterRight">
					<div className="RegisterRightCont">
						<h3>Why Register?</h3>
						<p>
							By registering, you get access to a wide range of services that
							includes:
						</p>
						<ul>
							<li>
								<i className="fas fa-check-circle"></i> Access to a wide range
								of agricultural products and services
							</li>
							<li>
								<i className="fas fa-check-circle"></i> Access to a wide range
								of agricultural products and services
							</li>
							<li>
								<i className="fas fa-check-circle"></i> Access to a wide range
								of agricultural products and services
							</li>
							<li>
								<i className="fas fa-check-circle"></i> Access to a wide range
								of agricultural products and services
							</li>
						</ul>
					</div>
				</div>
			</div>
			<p>
				@2023 All rights reserved by <span>Agrisolve</span>
			</p>
		</div>
	);
};

export default Register;
