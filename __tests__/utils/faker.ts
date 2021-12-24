import { tmpdir } from "os"
import { join } from "path"
import { v4 } from "uuid"
import { mkdirSync, writeFileSync, rmdirSync } from "fs"

interface FakerWorkSpace {
  path: string
  repos: { [key: string]: string }
  addRepos: (...repos: Array<string>) => void
}

export interface FakeProject {
  name: string
  path: string
  package: {
    name: string
    path: string
  }
}

const storage: { workspaces: Array<string> } = {
  workspaces: [],
}

class FakeWorkSpace implements FakerWorkSpace {
  readonly path: string
  readonly repos: { [key: string]: string }
  constructor(path: string) {
    this.path = path
    this.repos = {}
  }
  addRepos = (...repos: Array<string>) => {
    repos.forEach((repo) => {
      const dir = join(this.path, repo)
      mkdirSync(dir)
      this.repos[repo] = dir
    })
  }
}

export const ws = {
  fake: (): FakerWorkSpace => {
    const path = join(tmpdir(), v4())
    mkdirSync(path)
    storage.workspaces.push(path)
    return new FakeWorkSpace(path)
  },
  clear: (): void => {
    storage.workspaces.forEach((worspace) =>
      rmdirSync(worspace, { recursive: true })
    )
    storage.workspaces = []
  },
}

export const ramdonString = (length: number): string => {
  const result = new Array(length).fill("")
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  return result
    .map(() => list.charAt(Math.floor(Math.random() * list.length)))
    .join("")
}

export const fakeProject = (folder: string, scope = ""): FakeProject => {
  const makeName = (name: string, scope: string) =>
    scope ? `@${scope}/${name}` : name
  const projetcName = ramdonString(10)
  const projectPath = join(folder, projetcName)
  const packageName = makeName(projetcName, scope)
  const packagePath = join(projectPath, "package.json")

  mkdirSync(projectPath)
  writeFileSync(packagePath, `{"name":"${packageName}"}`)

  return {
    name: projetcName,
    path: projectPath,
    package: {
      name: packageName,
      path: packagePath,
    },
  }
}
