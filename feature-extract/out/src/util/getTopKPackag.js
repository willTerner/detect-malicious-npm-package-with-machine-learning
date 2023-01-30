var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { stringify } from 'csv-stringify/sync';
import { writeFile } from 'fs/promises';
export function getTopPackages(packageNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const csvPath = "/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top" + packageNumber + ".csv";
            const response = yield axios.get('https://api.npmjs.org/downloads/range/last-month/all');
            const packages = response.data.rows
                .sort((a, b) => b.downloads - a.downloads)
                .slice(0, 1000)
                .map(pkg => pkg.package);
            let outputArr = packages.map(el => [el]);
            yield writeFile(csvPath, stringify(outputArr));
        }
        catch (error) {
            console.error(error);
        }
    });
}
//# sourceMappingURL=getTopKPackag.js.map