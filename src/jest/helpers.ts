import path from "path"
import { readdirSync, existsSync, readFileSync } from "fs"

export interface PackageDetails {
  /**
   * Package name, the name that is defined in the package.json
   */
  name: string
  /**
   * Absolute path of the package.
   */
  path: string
  /**
   * Absolute path of the package.json of the package.
   */
  packageFile: string
}

export interface PackageConfig {
  displayName: string
  roots: Array<string>
  collectCoverageFrom: Array<string>
}

export interface PackageInfoOptions {
  projectDir: string
  roots?: Array<string>
  collectCoverageFrom?: Array<string>
}

/**
 * Get a list of all packages information that you have created in the monorepo.
 *
 * @param repos - List of relative path of monorepo package repositories
 * @returns A list  of packages information.
 */
export const getPackagesList = (repos: Array<string>): Array<PackageDetails> =>
  repos
    .map((repo) => path.resolve(repo))
    .filter((repo) => existsSync(repo))
    .map((repo) =>
      readdirSync(repo, { withFileTypes: true })
        .filter(
          (item) =>
            item.isDirectory() &&
            existsSync(path.join(repo, item.name, "package.json"))
        )
        .map(({ name }) => ({
          name,
          path: path.join(repo, name),
          packageFile: path.join(repo, name, "package.json"),
        }))
    )
    .reduce((acc, items) => {
      items.forEach((pckg) => acc.push(pckg))
      return acc
    }, [])

/**
 * Convert a package.json name property in a human name.
 *
 * @param name - A package.json name property.
 * @returns A human project name.
 */
export const getPackageTitle = (name: string): string =>
  name
    .replace("@", "")
    .split(/\/|-/)
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ")

/**
 * Get a project info to generate a project info.
 *
 * @param opts - Configuration options to generate project info.
 * @returns An object with the project configuration.
 */
export const getPackageConfig = (opts: PackageInfoOptions): PackageConfig => {
  const {
    projectDir,
    roots = ["src", "__tests__", "__mocks__"],
    collectCoverageFrom = ["src/**/*.ts"],
  } = opts

  const { name } = JSON.parse(
    readFileSync(path.join(projectDir, "package.json")).toString()
  )

  return {
    displayName: getPackageTitle(name),
    roots: roots.map((root) => path.join(projectDir, root)),
    collectCoverageFrom: collectCoverageFrom.map((dir) =>
      path.join(projectDir, dir)
    ),
  }
}
