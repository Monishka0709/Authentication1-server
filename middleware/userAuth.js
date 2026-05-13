import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(404).json({ success: false, message: 'Token not found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.userId = decoded.id;
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

export default userAuth;