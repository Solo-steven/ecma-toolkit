import { createParser } from "@/src/parser";


// todo: add case `await a.test?.(await cc(), aa  ).s.d`
// todo add case `{ "test": content, ...a , }`
// to ass case `a = { b: 10 + 10, ...c, c: aa + yy, ...sssa, k, async *p(mm, d) {}, async [bb] () {}, o: (m = 10, v) => {} }`