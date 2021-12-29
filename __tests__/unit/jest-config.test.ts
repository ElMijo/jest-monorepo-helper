import { getPackagesList, getPackageConfig } from "../../src/jest/helpers"
import {
  rootWithoutProjects,
  rootWithProjects,
  projectDefaultConfig,
  projectCustomConfig,
} from "../__fixtures__/jes-config.json"
import { jestRootConfig, jestPackageConfig } from "../../src"

jest.mock("../../src/jest/helpers")

const getPackagesListMock = getPackagesList as jest.MockedFunction<
  typeof getPackagesList
>

const getPackageConfigMock = getPackageConfig as jest.MockedFunction<
  typeof getPackageConfig
>

const projectInfo = {
  displayName: "Any Name",
  roots: ["src", "__tests__", "__mocks__"],
  collectCoverageFrom: ["src/**/*.ts"],
}

getPackageConfigMock.mockReturnValue(projectInfo)

afterEach(() => jest.clearAllMocks())

describe("jestPackageConfig", () => {
  it("Should generate a valid Jest project configuration, default arguments", () => {
    expect(jestPackageConfig({ projectDir: "any-path" })).toStrictEqual({
      ...projectDefaultConfig,
      ...projectInfo,
    })
    expect(getPackageConfigMock).toBeCalledWith({ projectDir: "any-path" })
  })
  it("Should generate a valid Jest project configuration, custom arguments", () => {
    expect(
      jestPackageConfig({ projectDir: "any-path" }, "myconfig")
    ).toStrictEqual({
      ...projectCustomConfig,
      ...projectInfo,
    })
    expect(getPackageConfigMock).toBeCalledWith({ projectDir: "any-path" })
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
