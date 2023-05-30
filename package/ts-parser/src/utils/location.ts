import type { SourcePosition } from "./position";
import { createSourcePosition, cloneSourcePosition } from "./position";

export interface SourceLocation {
    start: SourcePosition;
    end: SourcePosition;
};

export function createSourceLocation(): SourceLocation {
    return {
        start: createSourcePosition(),
        end: createSourcePosition(),
    }
}

export function cloneSourceLocation(source: SourceLocation): SourceLocation {
    return {
        start: cloneSourcePosition(source.start),
        end: cloneSourcePosition(source.end),
    }
}