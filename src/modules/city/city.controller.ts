// src/controllers/countryController.ts

import { Request, Response, NextFunction } from 'express';
import cityService from './city.service';

export const getAllCountries = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const countries = await cityService.getAllCountries();
        res.status(200).json(countries);
    } catch (error) {
        next(error);
    }
};
