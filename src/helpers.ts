import path from "path"
import { readdirSync, existsSync, readFileSync } from "fs"

export interface MonoRepoHelperPackage {
  name: string
  path: string
  packageFile: string
}

export interface MonoRepoHelperProjectConfig {
  displayName: string
  roots: Array<string>
  collectCoverageFrom: Array<string>
}

export interface MonoRepoHelperProjectInfoOpts {
  projectDir: string
  roots?: Array<string>
  collectCoverageFrom?: Array<string>
}

export const getPackagesList = (
  repos: Array<string>
): Array<MonoRepoHelperPackage> =>
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

export const getProjectTitle = (name: string): string =>
  name
    .replace("@", "")
    .split(/\/|-/)
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ")

export const getProjectInfo = (
  opts: MonoRepoHelperProjectInfoOpts
): MonoRepoHelperProjectConfig => {
  const {
    projectDir,
    roots = ["src", "__tests__", "__mocks__"],
    collectCoverageFrom = ["src/**/*.ts"],
  } = opts

  const { name } = JSON.parse(
    readFileSync(path.join(projectDir, "package.json")).toString()
  )

  return {
    displayName: getProjectTitle(name),
    roots: roots.map((root) => path.join(projectDir, root)),
    collectCoverageFrom: collectCoverageFrom.map((dir) =>
      path.join(projectDir, dir)
    ),
  }
}
