import pool from "../config/db.js";
import enquiryQueries from "../queries/enquiryQueries.js";
import { addToGoogleSheet } from "../services/googleSheetService.js";

const generateEnquiry = async (req, res) => {
    const { firstName, lastName, email, organization, projectType, projectDetails, newsletter } = req.body;

    if (!firstName || !lastName || !email || !projectType || !projectDetails) {
        return res.status(400).json({
            success: false,
            error: 'All required fields must be filled'
        });
    }

    try {
        const connection = await pool.getConnection();

        // Insert new enquiry
        await connection.query(
            enquiryQueries.generateEnquiry,
            [firstName, lastName, email, organization, projectType, projectDetails, newsletter || false]
        );

        connection.release();

        try {
            await addToGoogleSheet({ firstName, lastName, email, organization, projectType, projectDetails, newsletter });
        } catch (sheetError) {
            console.error('Google Sheets insert failed:', sheetError);
        }

        return res.status(200).json({
            success: true,
            message: 'Enquiry submitted successfully. We will contact you within 24 hours.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to submit enquiry',
            message: error.message
        });
    }
}

export { generateEnquiry }; 