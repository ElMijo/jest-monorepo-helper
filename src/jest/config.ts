import { Config } from "@jest/types"
import { defaults as tsjPreset } from "ts-jest/presets"
import {
  getPackagesList,
  getPackageConfig,
  PackageInfoOptions,
} from "./helpers"

/**
 * Extending Jest configuration object for documentation.
 */
export interface JestConfig extends Config.InitialOptions {}

/**
 * Base Jest configuration object.
 */
const baseConfig: JestConfig = {
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: ".coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/types/"],
  coverageReporters: ["json", "text", "lcov"],
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
  moduleFileExtensions: ["json", "js", "jsx", "ts", "tsx"],
  modulePathIgnorePatterns: ["fixtures", "__fixtures__"],
  transform: { ...tsjPreset.transform },
  transformIgnorePatterns: ["/node_modules/"],
}

/**
 * Generate a Jest configuration object for Typescript projects.
 *
 * @param tsConfigName - The name of the Typescript configuration.
 * @returns A Jest configuration object for Typescript projects.
 */
const getJestTsConfig = (tsConfigName: string): JestConfig => ({
  ...baseConfig,
  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/${tsConfigName}.json`,
    },
  },
})

/**
 * Generate a Jest configuration object for an specific package.
 *
 * ## Quick use
 *
 * **ES6**
 * ```ts
 * // ./packages/packageA/jest.config.ts
 * import { jestPackageConfig } from "@elmijo/monorepo-helper"
 * export default jestPackageConfig({ projectDir: __dirname })
 * ```
 * **CommonJS**
 * ```ts
 * // ./packages/packageA/jest.config.ts
 * const { jestPackageConfig } = require("@elmijo/monorepo-helper")
 * module.exports = jestPackageConfig({ projectDir: __dirname })
 * ```
 *
 * ## Custom use
 *
 * **ES6**
 * ```ts
 * // ./packages/packageA/jest.config.ts
 * import { Config } from "@jest/types"
 * import { jestPackageConfig } from "@elmijo/monorepo-helper"
 * export default {
 *  ...jestPackageConfig({ projectDir: __dirname }),
 *  verbode: true
 * } as Config.InitialOptions
 * ```
 * **CommonJS**
 * ```ts
 * // ./packages/packageA/jest.config.ts
 * const { jestPackageConfig } = require("@elmijo/monorepo-helper")
 * module.exports = {
 *  ...jestPackageConfig({ projectDir: __dirname })
 *  verbose: true
 * }
 * ```
 *
 * @param projectOpts - configuration options to generate a Jest configuration.
 * @param tsConfigName - The name of the tsconfig file.
 * @returns A Jest configuration object.
 */
export const jestPackageConfig = (
  projectOpts: PackageInfoOptions,
  tsConfigName = "tsconfig"
): JestConfig => ({
  ...getJestTsConfig(tsConfigName),
  ...getPackageConfig(projectOpts),
})

/**
 * Generate a root Jest configuration object for monorepos.
 *
 * ## Quick use
 *
 * **ES6**
 * ```ts
 * // jest.config.ts
 * import { jestRootConfig } from "@elmijo/monorepo-helper"
 * export default jestRootConfig(["./packages"])
 * ```
 * **CommonJS**
 * ```js
 * // jest.config.ts
 * const { jestRootConfig } = require("@elmijo/monorepo-helper")
 * module.exports =  jestRootConfig(["./packages"])
 *```
 * ## Custom use
 *
 * **ES6**
 * ```ts
 * // jest.config.ts
 * import { Config } from "@jest/types"
 * import { jestRootConfig } from "@elmijo/monorepo-helper"
 * export default {
 *  ...jestRootConfig(["./packages"]),
 *  verbose: true
 * } as Config.InitialOptions
 * ```
 * **CommonJS**
 * ```js
 * // jest.config.ts
 * const { jestRootConfig } = require("@elmijo/monorepo-helper");
 * module.exports =  {
 *  ...jestRootConfig(["./packages"]),
 *  verbose: true
 * };
 * ```
 *
 * @param packageRepos - List of package repositories
 * @param tsConfigName - The name of the Typescript configuration
 * @returns Return a Jest configuration object.
 */
export const jestRootConfig = (
  packageRepos: Array<string>,
  tsConfigName = "tsconfig"
): JestConfig => ({
  ...getJestTsConfig(tsConfigName),
  projects: getPackagesList(packageRepos).map((repo) => repo.path),
})
