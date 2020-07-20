import {Command, flags} from '@oclif/command'
import {generateServer, GeneratorError, tsConfigExists} from '../gen'
import {isValidServerFrameworkOption, ServerFrameworkOption} from '../gen/server'
import {writeOutput} from '../gen/util'

export default class Server extends Command {
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
    // Set the server framework option to fastify by default for now
    // until other framework are implemented.
    const serverFramework: ServerFrameworkOption = 'fastify'
    await this.validateTsConfigFile(tsConfig)
    this.validateServerFramework(serverFramework)
    this.validateOutputPath(outputPath)
    const code = await generateServer(tsConfig, outputPath, serverFramework as ServerFrameworkOption)
    if (code instanceof GeneratorError) {
      throw code
    }
    this.log(`generating server code using ${serverFramework}`)
    const res = await writeOutput(outputPath, code, 'types')
    if (res instanceof GeneratorError) {
      this.log(res.errorMessage)
    } else {
      this.log(res)
    }
  }

  // ensure that the path to tsconfig.json actually exists
  private async validateTsConfigFile(tsConfigFile: string): Promise<void> {
    const exists = await tsConfigExists(tsConfigFile)
    if (tsConfigFile === '' || !exists) {
      this.log('error: please provide a path to a valid tsconfig.json file')
      throw new Error('tsconfig.json is invalid or does not exist')
    }
  }

  // ensure that the ServerFrameworkOption is valid
  private validateServerFramework(framework: string): void {
    if (!isValidServerFrameworkOption(framework)) {
      this.log(`sorry ${framework} is not a valid server framework option or has not yet been implemented`)
      throw new Error('bad server framework option')
    }
  }

  // ensure the output path is not empty
  private validateOutputPath(outputPath: string): void {
    if (outputPath === '') {
      this.log('please provide a directory path to write generated output')
      throw new Error('no output path provided')
    }
  }
}
