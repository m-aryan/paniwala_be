import pool from "../config/db.js";
import resourceQueries from "../queries/resourceQueries.js";

// Insert resource
export const addResource = async (req, res) => {
    console.log("=== ADD RESOURCE DEBUG ===");
    console.log("Request body:", req.body);

    // Use req.files['img_url'][0] since we are using upload.fields()
    const file = req.files && req.files['img_url'] ? req.files['img_url'][0] : null;

    if (!file) {
        return res.status(400).json({ error: "Image file is required" });
    }

    console.log("File info:", {
        fieldname: file.fieldname,
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size
    });

    const { height, width, offsets, area_name, number_of_bubble, offsets_of_bubble_list, company_name } = req.body;

    if (!company_name) {
        return res.status(400).json({ error: "company_name is required" });
    }

    // Generate img_url from uploaded file
    const img_url = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    console.log("Generated img_url:", img_url);

    try {
        const connection = await pool.getConnection();

        // 1. Get company_id from company_name
        const [companyRows] = await connection.query(resourceQueries.getCompanyIdByName, [company_name]);
        if (companyRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: `Company '${company_name}' not found` });
        }
        const company_id = companyRows[0].id;

        // 2. Insert resource
        const [result] = await connection.query(resourceQueries.insertResource, [
            img_url,
            height || null,
            width || null,
            offsets || null,
            area_name || null,
            number_of_bubble || null,
            offsets_of_bubble_list || null,
            company_id
        ]);

        connection.release();

        res.status(201).json({
            message: "Resource added successfully",
            resourceId: result.insertId,
            company_id,
            img_url,
            file_info: {
                originalname: file.originalname,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            }
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Failed to insert resource",
            message: error.message,
        });
    }
};

// Get all resources
export const getResources = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(resourceQueries.getAllResources);
        connection.release();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch resources", message: error.message });
    }
};

// Get resource by ID
export const getResourceById = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(resourceQueries.getResourceById, [id]);
        connection.release();
        if (rows.length === 0) return res.status(404).json({ error: "Resource not found" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch resource", message: error.message });
    }
};