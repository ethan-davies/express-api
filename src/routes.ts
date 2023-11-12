import { Router } from 'express'
import helmet from 'helmet'

require('dotenv').config()

import Root from '@/routes/root'

class Routes {
    private router: Router

    constructor() {
        this.router = Router()
        this.initializeMiddlewares()
        this.initializeRoutes()
    }

    private initializeMiddlewares() {
        this.router.use(helmet())
    }

    private initializeRoutes() {
        this.router.use('/', Root)
    }

    public getRouter() {
        return this.router
    }
}

export default Routes
