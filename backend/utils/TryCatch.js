function TryCatch(handeler) {
    return async(req, resp, next) => {
        try {
            await handeler(req, resp, next);
        } catch (error) {
            resp.status(500).send(error.message)
        }
    }
}
module.exports = TryCatch;