import {flags} from '@oclif/command'
import {generateServer, GeneratorError} from '../gen'
import {Code} from '../gen/generator'
import {TypeRpcCommand} from './typerpc'

export default class Server extends TypeRpcCommand {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    tsConfig: flags.string({char: 't', name: 'tsconfig', description: 'path to tsconfig.json for project containing typeRPC schema files'}),
    output: flags.string({char: 'o', name: 'output', description: 'path to a directory to place generated code'}),

    /*     framework: flags.string({char: 'f', name: 'framework', description: 'which framework to use for generating the server code. Option are express | koa | fastify'}),
 */
    https: flags.boolean({name: 'https', description: 'controls whether the server should use https'}),
    http2: flags.boolean({name: 'http2', description: 'controls whether the server should use http2'}),

  }

  async run(): Promise<void> {
    const {flags} = this.parse(Server)

    const tsConfig = flags.tsConfig ?? ''
    const outputPath = flags.output ?? ''
    await this.validateTsConfigFile(tsConfig)

    this.validateOutputPath(outputPath)
    const serverGen = getServerGenerator(serverFramework, tsConfig, outputPath)
    const types: Code = typeof serverGen === 'string' ? {} : serverGen.generateTypes()
    if (types) {
      await this.writeOutput(outputPath, types, 'types')
    }

    const code = generateServer(tsConfig, outputPath)
    if (code instanceof GeneratorError) {
      this.log(code.errorMessage)
      throw code
    }
    this.log(`generating server code using ${serverFramework}`)
    await this.writeOutput(outputPath, code, 'types')
  }
}
