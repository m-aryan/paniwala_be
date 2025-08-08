import bcrypt from 'bcrypt'

import pool from "../config/db.js";
import authQueries from "../queries/authQueries.js";


// Aryan Mane (test123)
// Nikhil Rane (test789)
// Siddesh Wani (pass@123)
const login = async (req, res) => {
    const { phone, email, password } = req.body;

    if ((!phone && !email) || !password) {
        return res.status(400).json({ error: 'Phone or email and password are required' });
    }

    try {
        const connection = await pool.getConnection();

        let query;
        let params = [];

        if (phone && email) {
            query = authQueries.findUserByPhoneOrEmail;
            params = [phone, email];
        } else if (phone) {
            query = authQueries.findUserByPhone;
            params = [phone];
        } else {
            query = authQueries.findUserByEmail;
            params = [email];
        }

        const [rows] = await connection.query(query, params);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No matching user found' });
        }

        const user = rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Return user data
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to login',
            message: error.message,
        });
    }
};

const signup = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const fullName = `${firstName} ${lastName}`;                    

    try {
        const connection = await pool.getConnection();

        const [existing] = await connection.query(
            authQueries.findUserByPhoneOrEmail,
            [email, phone]
        )

        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({
                error: 'User with this email or phone already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            authQueries.registerUser,
            [fullName, phone, email, hashedPassword]
        );
        connection.release();

        return res.status(200).json({
            message: 'user Registered Successfully'
        });


    } catch (error) {
        return res.status(500).json({
            error: 'Failed to register user',
            message: error.message
        });
    }
};

export { login, signup };