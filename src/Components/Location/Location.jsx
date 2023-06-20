import React, { useState } from "react";
import "./Location.css";

const Location = () => {
  const [formValues, setFormValues] = useState({
    county: "",
    city: "",
    address: "",
    postalCode: "",
    nearestPostOffice: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // Form is valid, save the data to local storage
      saveFormData(formValues);
      displayMessage("success", "Location data saved successfully!");
      setFormValues({
        county: "",
        city: "",
        address: "",
        postalCode: "",
        nearestPostOffice: "",
      });
    } else {
      setFormErrors(errors);
      displayMessage("error", "Please fix the form errors.");
    }
  };

  const saveFormData = (data) => {
    // Store the form data in local storage
    localStorage.setItem("locationData", JSON.stringify(data));
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.county) {
      errors.county = "County is required";
    }
    if (!formValues.city) {
      errors.city = "City/Town is required";
    }
    if (!formValues.address) {
      errors.address = "Postal Address is required";
    }
    if (!formValues.postalCode) {
      errors.postalCode = "Postal/Zip Code is required";
    }
    if (!formValues.nearestPostOffice) {
      errors.nearestPostOffice = "Nearest Post Office is required";
    }
    return errors;
  };

  const displayMessage = (type, message) => {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
      messageContainer.innerText = message;
      messageContainer.className = `Message ${type}`;
      setTimeout(() => {
        messageContainer.innerText = "";
        messageContainer.className = "Message";
      }, 3000);
    }
  };

  return (
    <div className="Location">
      <form className="LocationForm" onSubmit={handleSubmit}>
        <h2>Add Location</h2>
        <div className="LocationInfo">
          <div className="RightInfo">
            <div className="FormSection">
              <label htmlFor="county">County</label>
              <input
                type="text"
                id="county"
                name="county"
                value={formValues.county}
                onChange={handleChange}
              />
              {formErrors.county && (
                <span className="ErrorMessage">{formErrors.county}</span>
              )}
            </div>
            <div className="FormSection">
              <label htmlFor="city">City/Town</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formValues.city}
                onChange={handleChange}
              />
              {formErrors.city && (
                <span className="ErrorMessage">{formErrors.city}</span>
              )}
            </div>
            <div className="FormSection">
              <label htmlFor="address">Postal Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formValues.address}
                onChange={handleChange}
              />
              {formErrors.address && (
                <span className="ErrorMessage">{formErrors.address}</span>
              )}
            </div>
          </div>
          <div className="LeftInfo">
            <div className="FormSection">
              <label htmlFor="postalCode">Postal/Zip Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formValues.postalCode}
                onChange={handleChange}
              />
              {formErrors.postalCode && (
                <span className="ErrorMessage">{formErrors.postalCode}</span>
              )}
            </div>
            <div className="FormSection">
              <label htmlFor="nearestPostOffice">Nearest Post Office</label>
              <input
                type="text"
                id="nearestPostOffice"
                name="nearestPostOffice"
                value={formValues.nearestPostOffice}
                onChange={handleChange}
              />
              {formErrors.nearestPostOffice && (
                <span className="ErrorMessage">
                  {formErrors.nearestPostOffice}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="ButtonSection">
          <button className="CancelButton">Cancel</button>
          <button className="SaveButton" type="submit">
            Save
          </button>
        </div>
      </form>
      <div className="Message" id="messageContainer"></div>
    </div>
  );
};

export default Location;
