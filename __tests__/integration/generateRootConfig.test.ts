import { mkdirSync } from "fs"
import path from "path"
import { fakeProject, ws } from "../utils/faker"
import { jestRootConfig } from "../../src"
import { rootWithoutProjects } from "../__fixtures__/jes-config.json"

afterAll(() => ws.clear())

describe("Without projects", () => {
  it("Should generate a configuration", () => {
    const workspace = ws.fake()
    expect(jestRootConfig([workspace.path])).toStrictEqual(rootWithoutProjects)
  })
})

describe("With ptojects", () => {
  it("Should generate a valid configuration - one package repo", () => {
    const workspace = ws.fake()
    workspace.addRepos("repoA")
    const projectA = fakeProject(workspace.repos.repoA, "my")
    const projectB = fakeProject(workspace.repos.repoA)

    mkdirSync(path.join(workspace.repos.repoA, "fake-project-a"))
    mkdirSync(path.join(workspace.repos.repoA, "fake-project-b"))

    const expected = {
      ...rootWithoutProjects,
      ...{ projects: [projectA.path, projectB.path].sort() },
    }

    expect(jestRootConfig(Object.values(workspace.repos))).toStrictEqual(
      expected
    )
  })

  it("Should generate a valid configuration - multi package repos", () => {
    const workspace = ws.fake()
    workspace.addRepos("repoA")
    workspace.addRepos("repoB")
    const projectA = fakeProject(workspace.repos.repoA, "my")
    const projectB = fakeProject(workspace.repos.repoA)
    const projectC = fakeProject(workspace.repos.repoB, "you")
    const projectD = fakeProject(workspace.repos.repoB)

    mkdirSync(path.join(workspace.repos.repoA, "fake-project-a"))
    mkdirSync(path.join(workspace.repos.repoA, "fake-project-b"))
    mkdirSync(path.join(workspace.repos.repoB, "fake-project-c"))
    mkdirSync(path.join(workspace.repos.repoB, "fake-project-d"))

    const expected = {
      ...rootWithoutProjects,
      ...{
        projects: [
          projectA.path,
          projectB.path,
          projectC.path,
          projectD.path,
        ].sort(),
      },
    }

    expect(jestRootConfig(Object.values(workspace.repos))).toStrictEqual(
      expected
    )
  })
})
