class ApiError extends Error {
    status: number

    constructor(status: number,message:string) {
        super(message)
        this.status = status;
        this.message=message
    }

}

class BadRequest extends ApiError {
    constructor(message:string) {
        super(400, message);

        Object.setPrototypeOf(this, BadRequest.prototype);
    }
}
class Unauthorized extends ApiError {
    constructor(message:string="Unauthorized") {
        super(401, message);
        this.message=message

        Object.setPrototypeOf(this, Unauthorized.prototype);
    }
}
class Forbidden extends ApiError {
    constructor(message:string="Forbidden") {
        super(402, message);
        this.message=message

        Object.setPrototypeOf(this, Forbidden.prototype);
    }
}
class NotFound extends ApiError {
    constructor(message:string="Page not found") {
        super(404, message);
        this.message=message

        Object.setPrototypeOf(this, NotFound.prototype);
    }
}
class Conflict extends ApiError {
  constructor(message: string = "Already exists") {
    super(409, message);
    this.message = message;

    Object.setPrototypeOf(this, Conflict.prototype);
  }
}
class UnprocessableEntity extends ApiError {
  constructor(message: string = "Sintax error") {
    super(422, message);
    this.message = message;

    Object.setPrototypeOf(this, UnprocessableEntity.prototype);
  }
}

export { ApiError, BadRequest, Unauthorized, Forbidden, NotFound, Conflict, UnprocessableEntity };


