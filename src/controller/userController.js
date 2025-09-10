import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken';

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
            user: userWithoutPassword,
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Failed to login',
            message: error.message,
        });
    }
};

const signup = async (req, res) => {
    const { firstName, lastName, email, phone, password, companyName } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let companyId = null;
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

        const [companyRows] = await connection.query(
            authQueries.findCompanyByName,
            [companyName]
        );

        if (companyRows.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                error: 'Invalid company selected'
            });
        }

        companyId = companyRows[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            authQueries.registerUser,
            [fullName, phone, email, hashedPassword, companyId]
        );
        connection.release();

        return res.status(200).json({
            success: true,
            message: 'user Registered Successfully'
        });


    } catch (error) {
        return res.status(500).json({
            error: 'Failed to register user',
            message: error.message
        });
    }
};

const getCompanies = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.query(authQueries.getCompanies);
        connection.release();

        return res.status(200).json({
            message: 'Companies fetched successfully',
            companies: rows,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch companies',
            message: error.message,
        });
    }
};

const getUserProfile = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required in body' });
    }

    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.query(authQueries.findUserById, [id]);
        connection.release();

        if (rows.length == 0) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const user = rows[0];
        const { password, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: 'User detailed fetched successfully',
            user: userWithoutPassword,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    const { id: userId, name, phone, address, city, department, fcm_token } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "Error Processing User" });
    }

    const fieldsToUpdate = [];
    const params = [];

    if (name !== undefined) {
        fieldsToUpdate.push("name = ?");
        params.push(name);
    }
    if (phone !== undefined) {
        fieldsToUpdate.push("phone = ?");
        params.push(phone);
    }
    if (address !== undefined) {
        fieldsToUpdate.push("address = ?");
        params.push(address);
    }
    if (city !== undefined) {
        fieldsToUpdate.push("city = ?");
        params.push(city);
    }
    if (department !== undefined) {
        fieldsToUpdate.push("department = ?");
        params.push(department);
    }
    if (fcm_token !== undefined) {
        fieldsToUpdate.push("fcm_token = ?");
        params.push(fcm_token);
    }
    if (fieldsToUpdate === 0) {
        return res.status(400).json({ error: "Nothing to Update" });
    }

    params.push(userId);

    const query = authQueries.updateUserDetails(fieldsToUpdate);

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, params);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Something Went Wrong" })
        }

        return res.status(200).json({ message: "Profile Updated Successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update profile", message: error.message });
    }
};

const updateUserDevice = async (req, res) => {
    const { id: userId, device, platform } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Please provide user ID' });
    }

    if (device === undefined && platform === undefined) {
        return res.status(400).json({ error: 'Please provide device and/or platform to update' });
    }

    try {
        const params = [];

        if (device !== undefined) params.push(device);
        if (platform !== undefined) params.push(platform);

        params.push(userId);
        const query = authQueries.updateDeviceDetails;

        const connection = await pool.getConnection();
        const [result] = await connection.query(query, params);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or nothing to update' });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user', message: error.message });
    }
};


export { login, signup, getCompanies, updateUserDevice, updateProfile, getUserProfile }; 