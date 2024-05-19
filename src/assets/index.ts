import fs from 'fs';
import path from 'path';

export const BRUSH = fs.readFileSync(path.resolve(__dirname, './brush.svg'), 'utf-8');
export const PEOPLE = fs.readFileSync(path.resolve(__dirname, './people.svg'));
export const PEOPLE_TEXTURE = fs.readFileSync(path.resolve(__dirname, './people-texture.svg'));
export const FOG_SHIM = fs.readFileSync(path.resolve(__dirname, './fog-shim.svg'));
export const FOG_SHIM_REVERSE = fs.readFileSync(path.resolve(__dirname, './fog-shim-reverse.svg'));
