import pool from "../config/db.js";
import alertQueries from "../queries/alertQueries.js";
import { sendFCMToTopic } from "../services/fcmService.js";


const getAllAlertHistory = async (req, res) => {
    let connection;
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        connection = await pool.getConnection();

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
        if (connection) {
            connection.release();
        }
    }
};


const postZoneData = async (req, res) => {
    let connection;
    try {
        const { company_name, zone, floor, time } = req.body;

        if (!company_name || !zone || !floor || !time) {
            return res.status(400).json({
                status: 'error',
                error: 'Bad request',
                message: 'Missing required fields'
            });
        }

        try {
            new Date(time).toISOString();
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error: 'Bad request',
                message: 'Invalid time format. Use ISOF Format (e.g., 2025-09-12T14:30:00)'
            });
        }

        connection = await pool.getConnection();

        const [companyRows] = await connection.query(
            alertQueries.getCompanyByName,
            [company_name]
        );

        if (companyRows.length === 0) {
            return res.status(400).json({
                status: 'error',
                error: 'Bad request',
                message: 'Company not found'
            });
        }

        const company = companyRows[0];
        const receivedAt = new Date(time).toISOString();

        await connection.query(
            alertQueries.insertAlert,
            [company.id, company_name, zone, floor, time, false, null]
        );

        const title = `🚨 Emergency Alert: ${company_name}`;
        const body = `Alert at ${time}. Zone ${zone}, Floor ${floor}, ${company.company_address || 'Unknown Address'}`;

        const customData = {
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            type: "emergency_alert",
            company: company_name,
            zone: zone,
            floor: String(floor),
            time: time,
            address: company.company_address || ''
        };

        try {
            await sendFCMToTopic({
                topic: company.topic_name,
                title: title,
                body: body,
                data: customData
            });

            console.log(`Emergency alert sent to topic: ${company.topic_name} for company: ${company_name}`);
        } catch (fcmError) {
            console.error('FCM Error:', fcmError);
        }

        return res.status(200).json({
            status: 'received',
            topic: company.topic_name,
            company: company_name,
            message: 'Zone data received and notification sent'
        });

    } catch (error) {
        console.error('Error in postZoneData:', error);
        return res.status(500).json({
            error: 'Failed to process zone data',
            message: error.message
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

const updateSilenceStatus = async (req, res) => {
    let connection;

    try {
        const { company_name, zone, floor, time, silenced, silenced_by, unsilenced_by } = req.body;

        if (!company_name || !zone || floor === undefined || !time) {
            return res.status(400).json({
                status: 'error',
                error: 'Bad request',
                message: 'Missing required fields'
            });
        }

        connection = await pool.getConnection();

        // Check if entry exists
        const [existingRows] = await connection.query(
            alertQueries.findExistingEntry,
            [company_name, zone, floor, time]
        );

        let finalSilenced = silenced;
        let finalSilencedBy = silenced_by;
        let finalUnSilencedBy = unsilenced_by;

        // If unsilenced_by provided, auto-set silenced to false
        if (unsilenced_by !== undefined && unsilenced_by !== null) {
            finalSilenced = false;
        }

        if (existingRows.length === 0) {
            await connection.query(
                alertQueries.updateSilenceStatus,
                [finalSilenced, finalSilencedBy, finalUnSilencedBy, company_name, zone, floor, time]
            );
        } else {
            await connection.query(
                alertQueries.getCompanyByName,
                [company_name]
            );

            const companyId = companyRows.length > 0 ? companyRows[0].id : null;
            const receivedAt = new Date(time).toISOString();

            await connection.query(
                alertQueries.insertAlert,
                [companyId, company_name, zone, floor, time, receivedAt, finalSilenced || false, finalSilencedBy]
            );
        }

        return res.status(200).json({
            status: 'success',
            message: 'Silence status updated successfully'
        });

    } catch (error) {
        console.error('Error in updateSilencedSatus: ', error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to update silence status',
            message: error.message
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

const getZoneData = async (req, res) => {
    let connection;

    try {
        const { company_name } = req.query;

        connection = await pool.getConnection();

        let rows;

        if (company_name) {
            [rows] = await connection.query(
                alertQueries.getRecentZoneDataByCompany,
                [company_name]
            );
        } else {
            [rows] = await connection.query(
                alertQueries.getRecentZoneData
            );
        }

        return res.status(200).json({
            status: 'success',
            message: 'Zone data retrieved successfully',
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error in getZoneData:', error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to fetch zone data',
            message: error.message
        });
    } finally {
        if (connection) {
            connection.release();   
        }
    }
}


export {
    getAllAlertHistory,
    postZoneData,
    updateSilenceStatus,
    getZoneData
};
