import { readFile } from "fs/promises";
import { json } from "stream/consumers";
import { getDirectorySizeInBytes } from "../src/Util";

test("test dir size func", async() => {
   const jsonContent = await readFile("/Users/huchaoqun/Desktop/code/school-course/毕设/source-code/feature-extract/material/top-10000.json", {encoding: "utf-8"});
   expect(JSON.parse(jsonContent).length).toBe(9998);
});
