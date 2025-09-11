import pool from "../config/db.js";
import alertQueries from "../queries/alertQueries.js";

const getAllAlertHistory = async (req, res) => {
    let connection;
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        connection = await pool.getConnection();
        
        // ✅ Correct way - use limit and offset as parameters
        const [rows] = await connection.query(
            alertQueries.getAllAlertHistory + ` LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Alert history retrieved successfully',
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error("Error fetching alert history: ", error);
        return res.status(500).json({
            status: 'error',
            error: 'Internal server error',
            message: error.message
        });
    } finally {
        // ✅ Always release connection in finally block
        if (connection) {
            connection.release();
        }
    }
};

export {
    getAllAlertHistory,
};
