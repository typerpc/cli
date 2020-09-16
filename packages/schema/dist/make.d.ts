import { Node, TypeNode } from 'ts-morph';
import { DataType, Struct } from './data-type';
import { internal as _ } from '@typerpc/types';
export declare const typeError: (type: TypeNode | Node) => TypeError;
export declare const make: {
    struct: (type: Node | TypeNode) => Struct;
    structLiteral: (type: TypeNode | Node, makeDataType: (type: TypeNode | Node) => DataType) => DataType;
    map: (type: TypeNode | Node, makeDataType: (type: TypeNode | Node) => DataType) => DataType;
    tuple: (type: TypeNode | Node, makeDataType: (type: TypeNode | Node) => DataType) => DataType;
    list: (type: TypeNode | Node, makeDataType: (type: TypeNode | Node) => DataType) => DataType;
    scalar: (type: TypeNode | Node) => _.Scalar | undefined;
    readonly bool: _.Scalar;
    readonly int8: _.Scalar;
    readonly uint8: _.Scalar;
    readonly int16: _.Scalar;
    readonly uint16: _.Scalar;
    readonly int32: _.Scalar;
    readonly uint32: _.Scalar;
    readonly int64: _.Scalar;
    readonly uint64: _.Scalar;
    readonly float32: _.Scalar;
    readonly float64: _.Scalar;
    readonly nil: _.Scalar;
    readonly str: _.Scalar;
    readonly dyn: _.Scalar;
    readonly timestamp: _.Scalar;
    readonly unit: _.Scalar;
    readonly blob: _.Scalar;
};
//# sourceMappingURL=make.d.ts.map