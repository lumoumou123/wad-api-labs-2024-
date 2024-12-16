import express from 'express';
import User from './userModel';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // 验证输入数据是否完整
    if (!username || !password) {
        return res.status(400).json({
            code: 400,
            msg: "Bad Request: 'username' and 'password' are required."
        });
    }

    try {
        // 如果 action=register，创建新用户
        if (req.query.action === 'register') {
            const newUser = new User({ username, password });
            await newUser.save();
            return res.status(201).json({
                code: 201,
                msg: "User registered successfully."
            });
        } else {
            // 其他逻辑，例如验证用户
            const user = await User.findOne({ username, password });
            if (!user) {
                return res.status(401).json({ 
                    code: 401, 
                    msg: "Authentication failed." 
                });
            }
            return res.status(200).json({
                code: 200,
                msg: "Authentication successful."
            });
        }
    } catch (error) {
        // 捕获 Mongoose 验证错误和其他异常
        console.error("Error:", error.message);
        return res.status(500).json({
            code: 500,
            msg: "Internal Server Error",
            error: error.message
        });
    }
});


// Update a user
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});

export default router;