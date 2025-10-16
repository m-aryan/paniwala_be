const alertQueries = {

    // GET all alert history
    getAllAlertHistory: `
        SELECT floor, zone, silenced, received_at, silenced_by
        FROM alert_history
        ORDER BY time DESC
    `,

    // Get topic and address by company_name    
    getCompanyByName: `
        SELECT id, company_name, topic_name, company_address
        FROM company_topics
        WHERE company_name = ?
        LIMIT 1
    `,

    // Insert zome data into database
    insertAlert: `
        INSERT INTO alert_history (company_id, company_name, zone, floor, time, received_at, silenced, silenced_by) 
        VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)
    `,

    // Update silence status
    updateSilenceStatus: `
        UPDATE alert_history 
        SET silenced = ?, silenced_by = ?, unsilenced_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE company_name = ? AND zone = ? AND floor = ? AND time = ?
    `,

    // Check if entry exists
    findExistingEntry: `
        SELECT id FROM alert_history
        WHERE company_name = ? AND zone = ? AND floor = ? AND time = ?
        LIMIT 1
    `,

    // Get recent zone data
    getRecentZoneData: `
        SELECT *
        FROM alert_history
        WHERE time >= (UTC_TIMESTAMP() - INTERVAL 2 MINUTE)
        ORDER BY time DESC
    `,

    // Get recent zone data by company_name
    getRecentZoneDataByCompany: `
        SELECT *
        FROM alert_history
        WHERE company_name = ? 
          AND time >= (UTC_TIMESTAMP() - INTERVAL 2 MINUTE)
        ORDER BY time DESC
    `,
}

export default alertQueries;