import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";

export const register = async(req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    try {
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);
        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        const token = generateToken(user);
        res.status(201).json({ token });
    }

    catch (error: any) {
        if (error?.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};


export const login = async(req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    
    try {
        const user = await prisma.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user);
        res.status(200).json({ token });
    

    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


