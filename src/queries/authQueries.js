const authQueries = {

    // Login Queries
    findUserByPhoneOrEmail: `
        SELECT u.*, c.company_name
        FROM users u
        LEFT JOIN company_topics c ON u.company_id = c.id
        WHERE u.phone = ? OR u.email = ?
        LIMIT 1
    `,

    findUserByPhone: `
        SELECT u.*, c.company_name
        FROM users u
        LEFT JOIN company_topics c ON u.company_id = c.id
        WHERE u.phone = ?
        LIMIT 1
    `,


    findUserByEmail: `
        SELECT u.*, c.company_name
        FROM users u
        LEFT JOIN company_topics c ON u.company_id = c.id
        WHERE u.email = ?
        LIMIT 1
    `,


    // Register / SignUp Queries
    registerUser: `
        INSERT INTO users (name, phone, email, password, company_id)
        VALUES (?,?,?,?,?)
    `,

    getCompanies: `
        SELECT company_name FROM company_topics
    `,

    findCompanyByName: `
        SELECT id FROM company_topics
        WHERE company_name = ?
        LIMIT 1
    `,

    // Update Device and Bluetooth Name
    updateDeviceDetails: `
        UPDATE users 
        SET device = ?, platform = ? 
        WHERE id = ?

    `,


    // Get User Profile
    // findUserById: `
    //     SELECT 
    //         u.id, 
    //         u.name, 
    //         u.phone, 
    //         u.email, 
    //         u.created_at, 
    //         u.address, 
    //         u.city, 
    //         u.department, 
    //         u.device, 
    //         u.platform, 
    //         u.role, 
    //         u.fcm_token, 
    //         u.company_id,
    //         c.topic_name AS topic_subscribed
    //     FROM users u
    //     JOIN company_topics c ON u.company_id = c.id
    //     WHERE u.id = ?;
    // `,




findUserById: `
    SELECT 
        u.id, 
        u.name, 
        u.phone, 
        u.email, 
        u.created_at, 
        u.address, 
        u.city, 
        u.department, 
        u.device, 
        u.platform, 
        u.role, 
        u.fcm_token, 
        u.company_id,
        u.password,
        c.company_name
    FROM users u
    LEFT JOIN company_topics c ON u.company_id = c.id
    WHERE u.id = ?
    LIMIT 1
`
,

    // Update User Profile
    updateUserDetails: (fieldsToUpdate) => `
        UPDATE users
        SET ${fieldsToUpdate.join(",")}
        WHERE id = ?
    `,
}

export default authQueries;