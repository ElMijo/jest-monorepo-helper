import { Config } from "@jest/types"
import { defaults as tsjPreset } from "ts-jest/presets"
import {
  getPackagesList,
  getProjectInfo,
  MonoRepoHelperProjectInfoOpts as ProjectOpts,
} from "./helpers"

const baseConfig: Config.InitialOptions = {
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

const getJestTsConfig = (tsConfigName: string): Config.InitialOptions => ({
  ...baseConfig,
  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/${tsConfigName}.json`,
    },
  },
})

export const jestProjectConfig = (
  projectOpts: ProjectOpts,
  tsConfigName = "tsconfig"
): Config.InitialOptions => ({
  ...getJestTsConfig(tsConfigName),
  ...getProjectInfo(projectOpts),
})

export const jestRootConfig = (
  packageRepos: Array<string>,
  tsConfigName = "tsconfig"
): Config.InitialOptions => ({
  ...getJestTsConfig(tsConfigName),
  projects: getPackagesList(packageRepos).map((repo) => repo.path),
})
