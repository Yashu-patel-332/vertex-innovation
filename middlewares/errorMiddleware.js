const notFound = (req, res, next) => {
    res.status(404).send("Page Not Found");
};

const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(err.statusCode || 500).send(
        err.message || "Something went wrong"
    );
};

module.exports = {
    notFound,
    errorHandler
};