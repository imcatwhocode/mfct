#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import minimist from 'minimist';
import MFD from '../lib/mfd';

const args = minimist(process.argv.slice(2));
const file = readFileSync(resolve(args._[0]));

const mfd = new MFD(file);
console.log(mfd.getSectorTrailerData(37));
// Console.log(mfd.getKeysB());
