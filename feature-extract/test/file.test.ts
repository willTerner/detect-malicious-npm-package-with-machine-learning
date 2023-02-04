import { writeFile } from 'node:fs/promises';
import {stringify} from 'csv-stringify/sync';
import { opendir } from 'node:fs/promises';

test("test json", async() => {
   await writeFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/test/test.csv", stringify([[true, false]], {
      cast: {
         "boolean": function(value) {
            if (value) {
               return "true";
            }
            return "false";
         }
      }
   }))
});

test("teset opendir", async() => {
  
});