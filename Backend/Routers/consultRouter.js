const express = require("express");
const router = express.Router();
const Consult = require("../Models/consultModel");
const User = require("../Models/UserModel");

// Handler for GET request to /api/consults
// Fetches consults data
router.get("/consults", async (req, res) => {
	try {
		// Fetch the consults data from the database
		const consults = await Consult.find();
		res.status(200).json(consults);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching consults data",
			error: err,
		});
	}
});

// Handler for GET request to /api/consults/:id
// Fetches consults data by id
router.get("/consults/:id", async (req, res) => {
	try {
		// Fetch the consults data from the database
		const consult = await Consult.findById(req.params.id);
		res.status(200).json(consult);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching consults data",
			error: err,
		});
	}
});

// Handler for GET request to /api/consults/user/:username
// Fetches consults data by username
router.get("/consults/user/:username", async (req, res) => {
	try {
		// Fetch the consults data from the database
		const consults = await Consult.find({ username: req.params.username });
		res.status(200).json(consults);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching consults data",
			error: err,
		});
	}
});

// Handler for GET request to /api/consults/consultants/:consultant
// Fetches consults data by consultant
router.get("/consults/consultants/:consultant", async (req, res) => {
	try {
		// Fetch the consults data from the database
		const consults = await Consult.find({ consultant: req.params.consultant });
		res.status(200).json(consults);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching consults data",
			error: err,
		});
	}
});

// Handler for POST request to /api/consults
// Creates a new consult
router.post("/consults", async (req, res) => {
	try {
		// Create a new consult
		const newConsult = new Consult(req.body);
		// Save the new consult to the database
		const savedConsult = await newConsult.save();
		res.status(200).json(savedConsult);
	} catch (err) {
		res.status(400).json({
			message: "Error creating new consult",
			error: err,
		});
	}
});

// Handler for DELETE request to /api/consults/:id
// Deletes a consult by id
router.delete("/consults/:id", async (req, res) => {
	try {
		// Delete the consult from the database
		const deletedConsult = await Consult.findByIdAndDelete(req.params.id);
		res.status(200).json(deletedConsult);
	} catch (err) {
		res.status(400).json({
			message: "Error deleting consult",
			error: err,
		});
	}
});

// Handler for PATCH request to /api/consults/:id
// Updates a consult by id
router.patch("/consults/:id", async (req, res) => {
	try {
		// Update the consult in the database
		const updatedConsult = await Consult.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedConsult);
	} catch (err) {
		res.status(400).json({
			message: "Error updating consult",
			error: err,
		});
	}
});

// Handler for PUT request to /api/consults/:id
// Updates a consult by id
router.put("/consults/:id", async (req, res) => {
	try {
		// Update the consult in the database
		const updatedConsult = await Consult.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedConsult);
	} catch (err) {
		res.status(400).json({
			message: "Error updating consult",
			error: err,
		});
	}
});

module.exports = router;
