import { getPackagesList, getProjectInfo } from "../../src/helpers"
import {
  rootWithoutProjects,
  rootWithProjects,
  projectDefaultConfig,
  projectCustomConfig,
} from "../__fixtures__/jes-config.json"
import { jestRootConfig, jestProjectConfig } from "../../src"

jest.mock("../../src/helpers")

const getPackagesListMock = getPackagesList as jest.MockedFunction<
  typeof getPackagesList
>

const getProjectInfoMock = getProjectInfo as jest.MockedFunction<
  typeof getProjectInfo
>

const projectInfo = {
  displayName: "Any Name",
  roots: ["src", "__tests__", "__mocks__"],
  collectCoverageFrom: ["src/**/*.ts"],
}

getProjectInfoMock.mockReturnValue(projectInfo)

afterEach(() => jest.clearAllMocks())

describe("jestProjectConfig", () => {
  it("Should generate a valid Jest project configuration, default arguments", () => {
    expect(jestProjectConfig({ projectDir: "any-path" })).toStrictEqual({
      ...projectDefaultConfig,
      ...projectInfo,
    })
    expect(getProjectInfoMock).toBeCalledWith({ projectDir: "any-path" })
  })
  it("Should generate a valid Jest project configuration, custom arguments", () => {
    expect(
      jestProjectConfig({ projectDir: "any-path" }, "myconfig")
    ).toStrictEqual({
      ...projectCustomConfig,
      ...projectInfo,
    })
    expect(getProjectInfoMock).toBeCalledWith({ projectDir: "any-path" })
  })
})

describe("jestRootConfig", () => {
  afterEach(() => jest.clearAllMocks())
  it("Should generate a valid Jest config without projects", () => {
    getPackagesListMock.mockReturnValueOnce([])
    expect(jestRootConfig([])).toStrictEqual(rootWithoutProjects)
    expect(getPackagesListMock).toBeCalledWith([])
  })
  it("Should generate a valid Jest config with projects", () => {
    getPackagesListMock.mockReturnValueOnce([
      {
        name: "Project One",
        packageFile: "/some/path/project-one/package.json",
        path: "/some/path/project-one",
      },
      {
        name: "Project Two",
        packageFile: "/some/path/project-two/package.json",
        path: "/some/path/project-two",
      },
    ])
    expect(jestRootConfig(["/some/path"])).toStrictEqual(rootWithProjects)
    expect(getPackagesListMock).toBeCalledWith(["/some/path"])
  })
})
