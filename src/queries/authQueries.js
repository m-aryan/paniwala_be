const authQueries = {

    // Login Queries
    findUserByPhoneOrEmail: `
        SELECT * FROM users
        WHERE (phone = ? OR email = ?)
        LIMIT 1
    `,

    findUserByPhone: `
        SELECT * FROM users
        WHERE phone = ?
        LIMIT 1
    `,

    findUserByEmail: `
        SELECT * FROM users
        WHERE email = ?
        LIMIT 1
    `,

    // Register / SignUp Queries
    registerUser: `
    INSERT INTO users (name, phone, email, password)
    VALUES (?,?,?,?)
    `,

}

export default authQueries;