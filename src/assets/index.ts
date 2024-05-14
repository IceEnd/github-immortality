import fs from 'fs';
import path from 'path';

export const MOUNTAIN = fs.readFileSync(path.resolve(__dirname, './mountain.svg'), 'utf-8');
export const BRUSH = fs.readFileSync(path.resolve(__dirname, './brush.svg'), 'utf-8');
export const PEOPLE = fs.readFileSync(path.resolve(__dirname, './people.svg'));
export const PEOPLE_TEXTURE = fs.readFileSync(path.resolve(__dirname, './people-texture.svg'));
