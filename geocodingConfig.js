import dotenv from "dotenv";
dotenv.config();

import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'

const mapToken = process.env.MAP_TOKEN;
export const geocodingClient = mbxGeocoding({accessToken: mapToken});