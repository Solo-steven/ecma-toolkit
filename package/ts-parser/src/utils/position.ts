export interface SourcePosition {
    row: number;
    col: number;
    index: number;
}

export function createSourcePosition(): SourcePosition {
    return {
        row: 0,
        col: 0,
        index: 0
    };
}

export function cloneSourcePosition(source: SourcePosition): SourcePosition {
    return {...source};
}
