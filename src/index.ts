import { Config } from "@jest/types"
import { defaults as tsjPreset } from "ts-jest/presets"
import { getPackagesList } from "./helpers"

export const generateJestTsConfig = (
  packageRepos: Array<string>,
  tsConfigName: string = "tsconfig"
): Config.InitialOptions => ({
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: ".coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/types/"],
  coverageReporters: ["json", "text", "lcov"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ["js", "json", "ts"],
  modulePathIgnorePatterns: ["fixtures", "__fixtures__"],
  transform: {
    ...tsjPreset.transform,
  },
  transformIgnorePatterns: ["/node_modules/"],
  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/${tsConfigName}.json`,
    },
  },
  projects: getPackagesList(packageRepos).map((repo) => repo.path),
})

export {}
