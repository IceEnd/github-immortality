import fs from 'fs';
import path from 'path';

export const MOUNTAIN = fs.readFileSync(path.resolve(__dirname, './mountain.svg'), 'utf-8');
export const BRUSH = fs.readFileSync(path.resolve(__dirname, './brush.svg'), 'utf-8');
