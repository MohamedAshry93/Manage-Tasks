class ErrorHandlerClass {
    constructor(message, statusCode, data, name, stack) {
        (this.message = message),
            (this.statusCode = statusCode),
            (this.stack = stack ? stack : null),
            (this.data = data ? data : null),
            (this.name = name ? name : "Error");
    }
}

export default ErrorHandlerClass;
