class ErrorResponse extends Error{
    constructor(message, errorCode){
        super(message);
        this.statusCode = this.statusCode;
    }
}
module.exports = ErrorResponse;