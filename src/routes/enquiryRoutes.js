import express from "express";

import { generateEnquiry } from "../controller/enquiryController.js";

const enquiryRouter = express.Router();

enquiryRouter.post('/new-enquiry', generateEnquiry);

export default enquiryRouter;