class APiError extends Error {
    constructor(
        statusCode,
        message="Something Went Wrong",
        errors=[],
        statck = ""
        
        ){
            super();
            this.statusCode = statusCode;
            this.message = message;
            this.errors = errors;
            this.data = null;
            this.statck = statck

            if(statck){
                this.stack = statck
            }
            else{
                Error.captureStackTrace(this,this.constructor)
            }
        }
}

export {APiError}