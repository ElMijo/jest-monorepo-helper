import { fakeProject, ws, FakeProject } from "../utils/faker"
import { jestPackageConfig } from "../../src"
import {
  projectDefaultConfig,
  projectCustomConfig,
} from "../__fixtures__/jes-config.json"

afterAll(() => ws.clear())

const getExpected = (
  project: FakeProject,
  baseConfig: any = projectDefaultConfig
) => ({
  ...baseConfig,
  ...{
    displayName: project.name.charAt(0).toUpperCase() + project.name.slice(1),
    roots: [
      `${project.path}/src`,
      `${project.path}/__tests__`,
      `${project.path}/__mocks__`,
    ],
    collectCoverageFrom: [`${project.path}/src/**/*.ts`],
  },
})

it("Should generate a project configuration with default values", () => {
  const workspace = ws.fake()
  const project = fakeProject(workspace.path)

  expect(jestPackageConfig({ projectDir: project.path })).toStrictEqual(
    getExpected(project)
  )
})

it("Should generate a project configuration with custom values", () => {
  const workspace = ws.fake()
  const project = fakeProject(workspace.path)

  expect(
    jestPackageConfig({ projectDir: project.path }, "myconfig")
  ).toStrictEqual(getExpected(project, projectCustomConfig))
})
