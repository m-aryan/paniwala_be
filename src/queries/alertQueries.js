const alertQueries = {

    // GET all alert history
    getAllAlertHistory: `
        SELECT floor, zone, silenced, time, silenced_by
        FROM alert_history
        ORDER BY time DESC
    `,
}

export default alertQueries;