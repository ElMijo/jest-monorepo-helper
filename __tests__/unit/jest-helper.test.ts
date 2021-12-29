// import { tmpdir } from 'os'
import { join, resolve } from "path"
import { readdirSync, existsSync, readFileSync, Dirent } from "fs"
import {
  getPackagesList,
  getPackageTitle,
  getPackageConfig,
} from "../../src/jest/helpers"

jest.mock("fs")
jest.mock("path")

const joinMock = join as jest.MockedFunction<typeof join>
const resolveMock = resolve as jest.MockedFunction<typeof join>
const readdirSyncMock = readdirSync as jest.MockedFunction<typeof readdirSync>
const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>
const readFileSyncMock = readFileSync as jest.MockedFunction<
  typeof readFileSync
>

const getDirentMock = (name: string, isDir = false): Dirent => ({
  name,
  isFile: jest.fn(() => false),
  isDirectory: jest.fn(() => isDir),
  isBlockDevice: jest.fn(() => false),
  isCharacterDevice: jest.fn(() => false),
  isSymbolicLink: jest.fn(() => false),
  isFIFO: jest.fn(() => false),
  isSocket: jest.fn(() => false),
})

describe("getpackagesList", () => {
  afterEach(() => jest.clearAllMocks())
  it("Should return an empty list when given an empty list", () => {
    expect(getPackagesList([])).toStrictEqual([])
    expect(joinMock).not.toBeCalled()
    expect(resolveMock).not.toBeCalled()
    expect(existsSyncMock).not.toBeCalled()
    expect(readdirSyncMock).not.toBeCalled()
  })
  it("Should return an empty list when packages folder doesn't exists", () => {
    resolveMock.mockReturnValueOnce("/some/path/any-folder")
    existsSyncMock.mockReturnValueOnce(false)
    expect(getPackagesList(["/some/path/any-folder"])).toStrictEqual([])
    expect(joinMock).not.toBeCalled()
    expect(resolveMock).toBeCalledWith("/some/path/any-folder")
    expect(existsSyncMock).toBeCalledWith("/some/path/any-folder")
    expect(readdirSyncMock).not.toBeCalled()
  })
  it("Should return an empty list when packages folder exists but it's empty", () => {
    resolveMock.mockReturnValueOnce("/some/path/any-folder")
    existsSyncMock.mockReturnValueOnce(true)
    readdirSyncMock.mockReturnValueOnce([])
    expect(getPackagesList(["/some/path/any-folder"])).toStrictEqual([])
    expect(joinMock).not.toBeCalled()
    expect(resolveMock).toBeCalledWith("/some/path/any-folder")
    expect(existsSyncMock).toBeCalledWith("/some/path/any-folder")
    expect(readdirSyncMock).toBeCalledWith("/some/path/any-folder", {
      withFileTypes: true,
    })
  })
  it("Should return an empty list when packages folder exists but it doesn't have folders", () => {
    resolveMock.mockReturnValueOnce("/some/path/any-folder")
    existsSyncMock.mockReturnValueOnce(true)
    readdirSyncMock.mockReturnValueOnce([
      getDirentMock("file-one"),
      getDirentMock("file-two"),
    ])

    expect(getPackagesList(["/some/path/any-folder"])).toStrictEqual([])
    expect(joinMock).not.toBeCalled()
    expect(resolveMock).toBeCalledWith("/some/path/any-folder")
    expect(existsSyncMock).toBeCalledWith("/some/path/any-folder")
    expect(readdirSyncMock).toBeCalledWith("/some/path/any-folder", {
      withFileTypes: true,
    })
  })
  it("Should return an empty list when packages folder exists and folders are not packages", () => {
    resolveMock.mockReturnValueOnce("/some/path/any-folder")
    existsSyncMock.mockReturnValueOnce(true)
    existsSyncMock.mockReturnValueOnce(false)
    readdirSyncMock.mockReturnValueOnce([
      getDirentMock("file-one"),
      getDirentMock("package-one", true),
    ])

    joinMock.mockReturnValueOnce(
      "/some/path/any-folder/package-one/package.json"
    )

    expect(getPackagesList(["/some/path/any-folder"])).toStrictEqual([])
    expect(resolveMock).toBeCalledWith("/some/path/any-folder")
    expect(existsSyncMock).toBeCalledWith("/some/path/any-folder")
    expect(readdirSyncMock).toBeCalledWith("/some/path/any-folder", {
      withFileTypes: true,
    })
    expect(joinMock).toBeCalledTimes(1)
    expect(joinMock).toBeCalledWith(
      "/some/path/any-folder",
      "package-one",
      "package.json"
    )
    expect(existsSyncMock).toBeCalledWith(
      "/some/path/any-folder/package-one/package.json"
    )
  })
  it("Should return an list of packages - one repo", () => {
    resolveMock.mockReturnValueOnce("/some/path/any-folder")
    existsSyncMock.mockReturnValue(true)
    readdirSyncMock.mockReturnValueOnce([
      getDirentMock("file-one"),
      getDirentMock("package-one", true),
    ])

    joinMock.mockReturnValueOnce(
      "/some/path/any-folder/package-one/package.json"
    )
    joinMock.mockReturnValueOnce("/some/path/any-folder/package-one")
    joinMock.mockReturnValueOnce(
      "/some/path/any-folder/package-one/package.json"
    )

    expect(getPackagesList(["/some/path/any-folder"])).toStrictEqual([
      {
        name: "package-one",
        path: "/some/path/any-folder/package-one",
        packageFile: "/some/path/any-folder/package-one/package.json",
      },
    ])
    expect(resolveMock).toBeCalledWith("/some/path/any-folder")
    expect(existsSyncMock).toBeCalledWith("/some/path/any-folder")
    expect(readdirSyncMock).toBeCalledWith("/some/path/any-folder", {
      withFileTypes: true,
    })
    expect(joinMock).toBeCalledWith(
      "/some/path/any-folder",
      "package-one",
      "package.json"
    )
    expect(existsSyncMock).toBeCalledWith(
      "/some/path/any-folder/package-one/package.json"
    )

    expect(joinMock).toBeCalledWith(
      "/some/path/any-folder",
      "package-one",
      "package.json"
    )
    expect(joinMock).toBeCalledWith(
      "/some/path/any-folder",
      "package-one",
      "package.json"
    )
  })
  it("Should return an list of packages - multi repo", () => {
    resolveMock.mockReturnValueOnce("/some/path/repo-one")
    resolveMock.mockReturnValueOnce("/some/path/repo-two")
    existsSyncMock.mockReturnValue(true)
    readdirSyncMock.mockReturnValueOnce([getDirentMock("package-one", true)])
    readdirSyncMock.mockReturnValueOnce([getDirentMock("package-two", true)])

    joinMock.mockReturnValueOnce("/some/path/repo-one/package-one/package.json")
    joinMock.mockReturnValueOnce("/some/path/repo-one/package-one")
    joinMock.mockReturnValueOnce("/some/path/repo-one/package-one/package.json")

    joinMock.mockReturnValueOnce("/some/path/repo-two/package-two/package.json")
    joinMock.mockReturnValueOnce("/some/path/repo-two/package-two")
    joinMock.mockReturnValueOnce("/some/path/repo-two/package-two/package.json")

    expect(
      getPackagesList(["/some/path/repo-one", "/some/path/repo-two"])
    ).toStrictEqual([
      {
        name: "package-one",
        path: "/some/path/repo-one/package-one",
        packageFile: "/some/path/repo-one/package-one/package.json",
      },
      {
        name: "package-two",
        path: "/some/path/repo-two/package-two",
        packageFile: "/some/path/repo-two/package-two/package.json",
      },
    ])
    expect(resolveMock).toBeCalledWith("/some/path/repo-one")
    expect(existsSyncMock).toBeCalledWith("/some/path/repo-one")
    expect(resolveMock).toBeCalledWith("/some/path/repo-two")
    expect(existsSyncMock).toBeCalledWith("/some/path/repo-two")
    expect(readdirSyncMock).toBeCalledWith("/some/path/repo-one", {
      withFileTypes: true,
    })
    expect(readdirSyncMock).toBeCalledWith("/some/path/repo-two", {
      withFileTypes: true,
    })
    expect(joinMock).toBeCalledWith(
      "/some/path/repo-one",
      "package-one",
      "package.json"
    )
    expect(existsSyncMock).toBeCalledWith(
      "/some/path/repo-one/package-one/package.json"
    )
    expect(joinMock).toBeCalledWith(
      "/some/path/repo-two",
      "package-two",
      "package.json"
    )
    expect(existsSyncMock).toBeCalledWith(
      "/some/path/repo-two/package-two/package.json"
    )

    expect(joinMock).toBeCalledWith(
      "/some/path/repo-one",
      "package-one",
      "package.json"
    )
    expect(joinMock).toBeCalledWith(
      "/some/path/repo-one",
      "package-one",
      "package.json"
    )
    expect(joinMock).toBeCalledWith(
      "/some/path/repo-two",
      "package-two",
      "package.json"
    )
    expect(joinMock).toBeCalledWith(
      "/some/path/repo-two",
      "package-two",
      "package.json"
    )
  })
})

describe("getPackageTitle", () => {
  it.each([
    ["", ""],
    ["Name", "name"],
    ["Name", "@name"],
    ["Name One", "name-one"],
    ["Name One", "name/one"],
    ["Scope Name", "@scope/name"],
    ["Scope Name One", "@scope/name-one"],
  ])("Should return %s when given %s", (expected, value) => {
    expect(getPackageTitle(value)).toBe(expected)
  })
})

describe("getPackageConfig", () => {
  afterEach(() => jest.clearAllMocks())
  it("Should return a project info with default values", () => {
    readFileSyncMock.mockReturnValueOnce(Buffer.from('{"name": "@scope/name"}'))
    joinMock.mockReturnValueOnce("/some/path/project/package.json")
    joinMock.mockReturnValueOnce("/some/path/project/src")
    joinMock.mockReturnValueOnce("/some/path/project/__tests__")
    joinMock.mockReturnValueOnce("/some/path/project/__mocks__")
    joinMock.mockReturnValueOnce("/some/path/project/src/**/*.ts")
    expect(
      getPackageConfig({ projectDir: "/some/path/project" })
    ).toStrictEqual({
      displayName: "Scope Name",
      roots: [
        "/some/path/project/src",
        "/some/path/project/__tests__",
        "/some/path/project/__mocks__",
      ],
      collectCoverageFrom: ["/some/path/project/src/**/*.ts"],
    })
    expect(readFileSyncMock).toBeCalledWith("/some/path/project/package.json")
    expect(joinMock).toBeCalledWith("/some/path/project", "package.json")
    expect(joinMock).toBeCalledWith("/some/path/project", "src")
    expect(joinMock).toBeCalledWith("/some/path/project", "__tests__")
    expect(joinMock).toBeCalledWith("/some/path/project", "__mocks__")
    expect(joinMock).toBeCalledWith("/some/path/project", "src/**/*.ts")
  })
  it("Should return a project info with without roots neither collectCoverageFrom", () => {
    readFileSyncMock.mockReturnValueOnce(Buffer.from('{"name": "@scope/name"}'))
    joinMock.mockReturnValueOnce("/some/path/project/package.json")
    expect(
      getPackageConfig({
        projectDir: "/some/path/project",
        roots: [],
        collectCoverageFrom: [],
      })
    ).toStrictEqual({
      displayName: "Scope Name",
      roots: [],
      collectCoverageFrom: [],
    })
    expect(readFileSyncMock).toBeCalledWith("/some/path/project/package.json")
    expect(joinMock).toBeCalledTimes(1)
    expect(joinMock).toBeCalledWith("/some/path/project", "package.json")
  })
  it("Should return a project info with custom roots and collectCoverageFrom", () => {
    readFileSyncMock.mockReturnValueOnce(Buffer.from('{"name": "@scope/name"}'))
    joinMock.mockReturnValueOnce("/some/path/project/package.json")
    joinMock.mockReturnValueOnce("/some/path/project/lib")
    joinMock.mockReturnValueOnce("/some/path/project/lib/**/*.ts")
    expect(
      getPackageConfig({
        projectDir: "/some/path/project",
        roots: ["lib"],
        collectCoverageFrom: ["lib/**/*.ts"],
      })
    ).toStrictEqual({
      displayName: "Scope Name",
      roots: ["/some/path/project/lib"],
      collectCoverageFrom: ["/some/path/project/lib/**/*.ts"],
    })
    expect(readFileSyncMock).toBeCalledWith("/some/path/project/package.json")
    expect(joinMock).toBeCalledWith("/some/path/project", "package.json")
    expect(joinMock).toBeCalledWith("/some/path/project", "lib")
    expect(joinMock).toBeCalledWith("/some/path/project", "lib/**/*.ts")
  })
})
