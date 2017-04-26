'use strict';

function CustomError(req) {

    this.server = {
        internalError: {
            status: 500,
            message: req.__("server.internalError")
        }
    };
    this.page = {
        notFound: {
            status: 404,
            message: req.__("page.notFound")
        }
    };
    this.user = {
        badCredentials: {
            status: 401,
            message: req.__("user.badCredentials")
        }
    };
    this.token = {
        notFound: {
            status: 400,
            message: req.__("token.notFound")
        },
        invalid: {
            status: 401,
            message: req.__("token.invalid")
        }
    };
    this.tag = {
        invalid: {
            status: 400,
            message: req.__("invalidTag")
        }
    }
}

module.exports = customError;