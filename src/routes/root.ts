import express, { Request, Response } from 'express'
import axios from 'axios'
import { uptime } from 'process'

const router = express.Router()


router.get('/', async (req: Request, res: Response) => {
    let response = {
        'Runtime-Mode': process.env.NODE_ENV,
        'timestamp': new Date(),
        'version': process.env.npm_package_version
    }

    try {
        const uptimeRobotResponse = await axios.post(
            `https://api.uptimerobot.com/v2/getMonitors?api_key=${process.env.UPTIMEROBOT_KEY}`
        )

        const status: string = uptimeRobotResponse.data.stat
    
        return res.status(200).json({
            status: status.toUpperCase(),
            ...response
        })
    } catch (err) {
        res.status(200).json(response)
    }
})

export default router
