import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import axios from 'axios'

require('dotenv').config()

import Logger from '@/utils/Logger'

import Routes from '@/routes'

class Server {
    public app: Application

    constructor(private port: number) {
        this.app = express()
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeErrorHandlers()
    }

    private initializeMiddlewares() {
        this.app.use(
            cors({
                origin: '*',
                methods: ['GET', 'HEAD', 'POST', 'DELETE'],
            })
        )
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(helmet())
    }

    private initializeRoutes() {
        const routes = new Routes()
        this.app.use(routes.getRouter())
    }

    private async checkUptime() {
        try {
            const uptimeRobotResponse = await axios.post(
                `https://api.uptimerobot.com/v2/getMonitors?api_key=${process.env.UPTIMEROBOT_KEY}`
            )

            const status = uptimeRobotResponse.data.stat
            console.log(`Uptime Robot Status: ${status}`)
        } catch (error) {
            console.error('Error fetching Uptime Robot status:', error.message)
        }
    }

    private initializeErrorHandlers() {
        // Server error handler
        this.app.use(
            (err: any, req: Request, res: Response, next: NextFunction) => {
                console.error(err.stack)
                res.status(500).json({
                    status: 'ERROR',
                    error: {
                        code: 500,
                        message: 'Internal Server Error',
                    },
                    'Runtime-Mode': process.env.NODE_ENV,
                })
            }
        )

        // Error handler
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({
                status: 'ERROR',
                error: {
                    code: 404,
                    message: 'Page not found',
                },
                'Runtime-Mode': process.env.NODE_ENV,
            })
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            Logger.info(`Listening on port ${this.port}`)
        })

        setInterval(this.checkUptime, 5 * 60 * 1000)
    }
}

const port = parseInt(process.env.PORT || '3000')

const server = new Server(port)
server.listen()
