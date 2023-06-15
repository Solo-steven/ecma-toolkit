import { ModuleItem } from "@/src/ast";

export type Visitor = {[key: number ]: (node: ModuleItem) => void }