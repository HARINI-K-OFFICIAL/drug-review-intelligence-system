import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory mock user store
const users = [];

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = users.find(u => u.email === email);
        if (existingUser) return res.status(400).json({ msg: "User already exists." });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, 10); // using 10 rounds

        const newUser = {
            _id: String(users.length + 1),
            username,
            email,
            password: passwordHash
        };

        users.push(newUser);
        
        const savedUser = { ...newUser };
        delete savedUser.password;
        
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const JWT_SECRET = process.env.JWT_SECRET || 'secretkey_placeholder';
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        
        const userObj = { ...user };
        delete userObj.password;
        res.status(200).json({ token, user: userObj });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
