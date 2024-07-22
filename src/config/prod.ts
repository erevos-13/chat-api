export default {
    port: 5000,
    jwtSecret: process.env.JWT_SECRET,
    dbUrl: process.env.DATABASE_URL,
    logging: false,
}
