var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getRootDirectory } from './Util';
let jsonContent = "";
/**
 * @desciption
 * + 比较packageName和流行包名称的莱文斯坦距离，求莱文斯坦的算法<https://baike.baidu.com/item/%E8%8E%B1%E6%96%87%E6%96%AF%E5%9D%A6%E8%B7%9D%E7%A6%BB/14448097#4>
 * +  top-1000.json 包含最流行的10000个包
 * @return 返回最小的距离
 */
export function minEditDistance(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        let minDistance = Number.MAX_SAFE_INTEGER;
        if (!jsonContent) {
            jsonContent = yield readFile(join(getRootDirectory(), 'material', 'top-10000.json'), { encoding: "utf-8" });
        }
        const popularPackageNames = JSON.parse(jsonContent);
        for (const popularPackageName of popularPackageNames) {
            minDistance = Math.min(minDistance, editDistance(packageName, popularPackageName.name));
        }
        return minDistance;
    });
}
function editDistance(s1, s2) {
    const dp = new Array(s1.length + 1);
    for (let i = 0; i < dp.length; i++) {
        dp[i] = new Array(s2.length + 1).fill(0);
    }
    for (let i = 0; i < s2.length + 1; i++) {
        dp[0][i] = i;
    }
    for (let i = 0; i < s1.length + 1; i++) {
        dp[i][0] = i;
    }
    for (let i = 1; i < s1.length + 1; i++) {
        for (let j = 1; j < s2.length + 1; j++) {
            let replaceCost = 1;
            if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
                replaceCost = 0;
            }
            dp[i][j] = Math.min(dp[i][j - 1] + 1, dp[i - 1][j] + 1, dp[i - 1][j - 1] + replaceCost);
        }
    }
    return dp[s1.length][s2.length];
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield minEditDistance("eventstream"));
    });
}
//test();
//# sourceMappingURL=EditDistance.js.map