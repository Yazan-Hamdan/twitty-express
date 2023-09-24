import express from 'express'

export const router = express.Router

export const registerRoutes = (routes) => {
    for (let i in routes) {
        routes[i]
    }
}