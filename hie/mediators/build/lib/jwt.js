"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireJWTMiddleware = exports.checkExpirationStatus = exports.decodeSession = exports.isTokenExpired = exports.encodeSession = void 0;
const jwt_simple_1 = require("jwt-simple");
function encodeSession(secretKey, partialSession) {
    // Always use HS512 to sign the token
    const algorithm = "HS512";
    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    const session = Object.assign(Object.assign({}, partialSession), { issued: issued, expires: expires });
    return {
        token: jwt_simple_1.encode(session, secretKey, algorithm),
        issued: issued,
        expires: expires
    };
}
exports.encodeSession = encodeSession;
function isTokenExpired(token) {
    const now = Date.now();
    if (token.expires > now)
        return false;
    // Find the timestamp for the end of the token's grace period
    // const threeHoursInMs = 3 * 60 * 60 * 1000;
    // const threeHoursAfterExpiration = token.expires + threeHoursInMs;
    // if (threeHoursAfterExpiration > now) return "grace";
    return true;
}
exports.isTokenExpired = isTokenExpired;
function decodeSession(secretKey, tokenString) {
    // Always use HS512 to decode the token
    const algorithm = "HS512";
    let result;
    try {
        result = jwt_simple_1.decode(tokenString, secretKey, false, algorithm);
    }
    catch (e) {
        const _e = e;
        // These error strings can be found here:
        // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
        if (_e.message === "No token supplied" || _e.message === "Not enough or too many segments") {
            return {
                type: "invalid-token"
            };
        }
        if (_e.message === "Signature verification failed" || _e.message === "Algorithm not supported") {
            return {
                type: "integrity-error"
            };
        }
        // Handle json parse errors, thrown when the payload is nonsense
        if (_e.message.indexOf("Unexpected token") === 0) {
            return {
                type: "invalid-token"
            };
        }
        throw e;
    }
    return {
        type: "valid",
        session: result
    };
}
exports.decodeSession = decodeSession;
function checkExpirationStatus(token) {
    const now = Date.now();
    if (token.expires > now)
        return "active";
    // Find the timestamp for the end of the token's grace period
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const threeHoursAfterExpiration = token.expires + threeHoursInMs;
    if (threeHoursAfterExpiration > now)
        return "grace";
    return "expired";
}
exports.checkExpirationStatus = checkExpirationStatus;
function requireJWTMiddleware(request, response, next) {
    const unauthorized = (message) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });
    const requestHeader = "Authorization";
    const header = request.header(requestHeader);
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }
    const decodedSession = decodeSession(process.env['SECRET_KEY'], header.split(' ')[1]);
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }
    const expiration = checkExpirationStatus(decodedSession.session);
    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }
    let session;
    if (expiration === "grace") {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = encodeSession(process.env['SECRET_KEY'], decodedSession.session);
        session = Object.assign(Object.assign({}, decodedSession.session), { expires: expires, issued: issued });
        response.setHeader("Authorization", `Bearer ${token}`);
    }
    else {
        session = decodedSession.session;
    }
    // Set the session on response.locals object for routes to access
    response.locals = Object.assign(Object.assign({}, response.locals), { session: session });
    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}
exports.requireJWTMiddleware = requireJWTMiddleware;
