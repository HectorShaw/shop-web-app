import { unstable_cache as nextCache } from "next/cache"; //// next based caching
import { cache as reactCache } from "react"; //// req memoization

type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);

 
}
 // const cacheKey = `cache:${key}`;
  // const cached = localStorage.getItem(cacheKey);
  // if (cached) {
  //     return JSON.parse(cached);
  // }
  // const result = cb();
  // localStorage.setItem(cacheKey, JSON.stringify(result));
  // return result;