import path from 'path'
import { v4 } from 'uuid'
import { mkdirSync, writeFileSync, rmdirSync } from 'fs'

const storage: { workspaces: Array<string> } = {
  workspaces: [],
}

export const ws = {
  fake: (fodler: string, prefix: string = '') => {
    const workspace = path.join(fodler, `${prefix}-${v4()}`.replace(/^-/, ''))
    mkdirSync(workspace)
    storage.workspaces.push(workspace)
    return workspace
  },
  clear: () => {
    storage.workspaces.forEach((worspace) =>
      rmdirSync(worspace, { recursive: true })
    )
    storage.workspaces = []
  },
}

export const ramdonString = (length: number) => {
  const result = new Array(length).fill('')
  const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return result
    .map(() => list.charAt(Math.floor(Math.random() * list.length)))
    .join('')
}

export const fakeProject = (folder: string, scope: string = '') => {
  const makeName = (name: string, scope: string) =>
    scope ? `@${scope}/${name}` : name
  const projetcName = ramdonString(10)
  const projectPath = path.join(folder, projetcName)
  const packageName = makeName(projetcName, scope)
  const packagePath = path.join(projectPath, 'package.json')

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
