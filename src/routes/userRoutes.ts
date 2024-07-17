import { NextFunction, Router } from 'express';
import { register, login } from '../controllers/authController';
import { Request, Response } from 'express';
const router = Router();


// Middleware JWT

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401).json({ message: 'Unauthorized' });
    }
}


router.post('/', authenticateToken, () => {});
router.get('/', authenticateToken, () => {});
router.get('/:id', authenticateToken, () => {});
router.put('/:id', authenticateToken, () => {});
router.delete('/:id', authenticateToken, () => {});




export default router;