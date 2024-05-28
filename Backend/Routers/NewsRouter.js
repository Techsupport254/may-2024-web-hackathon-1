const express = require("express");
const router = express.Router();
const app = express();
const News = require("../Models/NewsModel");
app.use(express.json());

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get("/", async (req, res) => {
	try {
		const news = await News.find();
		res.json(news);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   POST api/news
// @desc    Add new news
// @access  Public
router.post("/", async (req, res) => {
	const {
		title,
		event,
		description,
		eventDate,
		from,
		to,
		location,
		address,
		link,
		images,
		fee,
	} = req.body;

	try {
		const newNews = new News({
			title,
			event,
			description,
			eventDate,
			from,
			to,
			location,
			address,
			link,
			images,
			fee,
		});

		const news = await newNews.save();

		res.json(news);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   PUT api/news/:id
// @desc    Update news
// @access  Public
router.patch("/:id", async (req, res) => {
	const {
		title,
		event,
		description,
		date,
		from,
		to,
		location,
		address,
		link,
		images,
		fee,
	} = req.body;

	try {
		const updatedNews = await News.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					title,
					event,
					description,
					date,
					from,
					to,
					location,
					address,
					link,
					images,
					fee,
				},
			}
		);

		res.json(updatedNews);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   DELETE api/news/:id
// @desc    Delete news
// @access  Public
router.delete("/:id", async (req, res) => {
	try {
		const removedNews = await News.deleteOne({ _id: req.params.id });
		res.json(removedNews);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
