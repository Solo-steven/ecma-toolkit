import { traversal as DeclarativeTraversal } from "@/src/visitor/declarative";
import { traversal as HalfInlineTraversal } from "@/src/visitor/half-inline";
import { traversal as AllInlineTraversal } from "@/src/visitor/all-inline";
import { validParent, createFakeAST, BindingTable } from "./helper";

import { Bench } from "tinybench";

const bench = new Bench({ time: 120 });

bench
  .add('declarative task', async () => {
    const ast = await createFakeAST();
    HalfInlineTraversal(ast, BindingTable);
  })
  .add('half inline task', async () => {
    const ast = await createFakeAST();
    DeclarativeTraversal(ast, BindingTable);
  })
  .add('all inline task', async () => {
    const ast = await createFakeAST();
    AllInlineTraversal(ast, BindingTable);
  })

bench.run().then(() => {
    console.table(bench.table());
}).catch(e => console.log(e));
