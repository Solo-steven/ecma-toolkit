export interface SourcePosition {
    row: number;
    col: number;
    index: number;
}

export function createSourcePosition(): SourcePosition {
    return {
        row: 1,
        col: 1,
        index: 0
    };
}

export function cloneSourcePosition(source: SourcePosition): SourcePosition {
    return {...source};
}

export interface SourceLocation {
    start: SourcePosition;
    end: SourcePosition;
}

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