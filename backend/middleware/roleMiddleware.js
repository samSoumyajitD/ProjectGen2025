exports.authorize = (...roles) => {
    return (req, res, next) => {
        try {
            // Ensure the user exists on the request object
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while checking permissions.' });
        }
    };
};
