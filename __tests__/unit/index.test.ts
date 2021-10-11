import { getPackagesList } from "../../src/helpers"
import { withoutProjects, withProjects } from "../__fixtures__/jes-config.json"
import { generateJestTsConfig } from "../../src"

jest.mock("../../src/helpers")

const getPackagesListMock = getPackagesList as jest.MockedFunction<
  typeof getPackagesList
>

describe("generateJestTsConfig", () => {
  afterEach(() => jest.clearAllMocks())
  it("Should generate a valid Jest config without projects", () => {
    getPackagesListMock.mockReturnValueOnce([])
    expect(generateJestTsConfig([])).toStrictEqual(withoutProjects)
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
    expect(generateJestTsConfig(["/some/path"])).toStrictEqual(withProjects)
    expect(getPackagesListMock).toBeCalledWith(["/some/path"])
  })
})
