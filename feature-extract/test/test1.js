import {readFileSync} from 'fs';

const str = readFileSync("./test2.txt", {encoding: 'utf-8'});
const result = str.match(/\".*(\\x[0-9a-f]{2})+.*\"/i);
console.log(result[1]);