
// import { Request, Response } from 'express';

// export const login = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Login endpoint' });
// };

// export const refreshToken = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Refresh endpoint' });
// };

// export const logout = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Logout endpoint' });
// };

// export const setupMfa = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Setup MFA endpoint' });
// };

export const enableMfa = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Enable MFA endpoint' });
};