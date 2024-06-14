import express from "express"
import { 
    login, register 
} from "./controller.js"

const router = express.Router()
router.get('/')
router.post('/register', register)   
router.post('/login', login)
router.patch('/')
router.delete('/')


export default router