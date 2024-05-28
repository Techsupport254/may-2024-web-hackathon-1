const router = require("express").Router();
const { sendEmailsToAllUsers } = require("../Controller/MailController");

/** HTTP Request */
router.post("/sendMail", sendEmailsToAllUsers);

module.exports = router;
