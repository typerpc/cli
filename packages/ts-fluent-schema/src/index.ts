/*
 * Copyright (c) 2020. Gary Becks - <techstar.dev@hotmail.com>
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Code } from '@typerpc/plugin'
import { DataType, is, make, MutationMethod, QueryMethod, Schema, StructLiteral } from '@typerpc/schema'
const typeMap: Map<string, string> = new Map<string, string>([
    [make.bool.type, 'boolean()'],
    [make.int8.type, 'number()'],
    [make.uint8.type, 'number()'],
    [make.int16.type, 'number()'],
    [make.uint16.type, 'number()'],
    [make.int32.type, 'number()'],
    [make.uint32.type, 'number()'],
    [make.int64.type, 'number()'],
    [make.uint64.type, 'number()'],
    [make.float32.type, 'number()'],
    [make.float64.type, 'number()'],
    [make.nil.type, 'null()'],
    [make.str.type, 'string()'],
    [make.dyn.type, ''],
    // Math.round(Date.now() / 1000)
    [make.timestamp.type, 'number()'],
    [make.unit.type, ''],
    [make.blob.type, 'array().items(S.number())'],
])

const buildObjectSchema = (struct: StructLiteral): string => {
    let obj = 'object()'
    for (const prop of struct.properties) {
        obj = obj.concat(`.prop('${prop.name}', S.${schemaType(prop.type)}${prop.isOptional ? '' : '.required()'})`)
    }
    return obj
}
const schemaType = (type: DataType): string => {
    if (is.dataType(type) !== true) {
        throw new TypeError(`${type} is not a valid typerpc Datatype`)
    }

    if (is.scalar(type)) {
        const res = typeMap.get(type.type)
        if (!res) {
            throw new TypeError('invalid data type')
        }
        return res
    }

    if (is.map(type)) {
        return 'object()'
    }

    if (is.list(type)) {
        return `array().items(${schemaType(type.dataType)})`
    }

    if (is.structLiteral(type)) {
        return buildObjectSchema(type)
    }
}

const buildBodySchema = (svcName: string, method: MutationMethod | QueryMethod): string => {
    let schema = `S.object().id('${svcName}.${method.name}').title('${svcName}.${method.name} Body').description('${svcName}.${method.name} Request body')`
    for (const param of method.params) {
        schema = schema.concat(`.prop('${param.name}')`)
    }
}

const buildImports = (): string => "import S from 'fluent-schema'"

const buildFile = (schema: Schema): Code => {}

// builds all schemas and server file
const build = (schemas: Schema[]): Code[] => [...schemas.map((schema) => buildFile(schema))]
export default build
