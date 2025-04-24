import express from 'express';
import { getAllCountries } from './city.controller';

const citiesRouter = express.Router();

citiesRouter.get('/', getAllCountries);

export default citiesRouter;
