/**
 * Custom error handler middleware for Express
 */

// Not found middleware - handles routes that don't exist
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Error handler middleware - formats error responses
const errorHandler = (err, req, res, next) => {
    // Set status code (use 500 if somehow the status code is still 200)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
