export default {
    port: process.env.PORT || 8001,
    hash: process.env.HASH || "123wdfj3p4j2;43@X#$T@#Fc2r$%cT$%fX$3",
    authToken: {
        expiresIn: 3600 // 3600 seconds = 1 hour
    },
    max_request: process.env.MAX_REQUESTS || 30
}