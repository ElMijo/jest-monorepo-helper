# Monorepo Helpers

[![Build Status](https://app.travis-ci.com/ElMijo/monorepo-helper.svg?branch=main)](https://app.travis-ci.com/ElMijo/monorepo-helper) [![codecov](https://codecov.io/gh/ElMijo/monorepo-helper/branch/main/graph/badge.svg?token=8DfGB9WxYx)](https://codecov.io/gh/ElMijo/monorepo-helper) [![Coverage Status](https://coveralls.io/repos/github/ElMijo/monorepo-helper/badge.svg?branch=main)](https://coveralls.io/github/ElMijo/monorepo-helper?branch=main)

This package has some helpers to work more easily with a Monorepository.

## Install

**yarn**

```bash
yarn add --dev @elmijo/monorepo-helpers
```

**npm**

```bash
npm i --save-dev @elmijo/monorepo-helpers
```

## Usage

### Single package repository

**Project skeleton**

```
project
| package.json
| index.ts
| README.md
|
└─packages
  |
  └─packageA
  |   package.json
  |   index.ts
  |   README.md
  |
  └─packageB
      package.json
      index.ts
      README.md
```

**Package A**

```ts
// packages/packageA/jest.config.ts
import { jestPackageConfig } from "@elmijo/monorepo-helper"

export default jestPackageConfig({ projectDir: __dirname })
```

**Package B**

```ts
// packages/packageB/jest.config.ts
import { jestPackageConfig } from "@elmijo/monorepo-helper"

export default jestPackageConfig({ projectDir: __dirname })
```

**Project**

```ts
// jest.config.ts
import { jestRootConfig } from "@elmijo/monorepo-helper"

export default jestRootConfig({ packageRepos: ["./packages"] })
```

### Multi package repositories

**Project skeleton**

```
project
| package.json
| index.ts
| README.md
|
└─frontend
| |
| └─packageA
|     package.json
|     index.ts
|     README.md
|
└─backend
  |
  └─packageB
      package.json
      index.ts
      README.md
```

**Package A**

```ts
// packages/frontend/packageA/jest.config.ts
import { jestPackageConfig } from "@elmijo/monorepo-helper"

export default jestPackageConfig({ projectDir: __dirname })
```

**Package B**

```ts
// packages/backend/packageB/jest.config.ts
import { jestPackageConfig } from "@elmijo/monorepo-helper"

export default jestPackageConfig({ projectDir: __dirname })
```

**Project**

```ts
// jest.config.ts
import { jestRootConfig } from "@elmijo/monorepo-helper"

export default jestRootConfig({ packageRepos: ["./frontend", "./backend"] })
```

### Custom configuration

Both functions work with a default configuration, but you can override them whenever you want. Let's use the single package repository example, you can do that:

```ts
// packages/packageA/jest.config.ts
import { Config } from "@jest/types"
import { jestPackageConfig } from "@elmijo/monorepo-helper"

export default {
  ...jestPackageConfig({ projectDir: __dirname }),
  verbose: true,
} as Config.InitialOptions
```

**Package B**

```ts
// packages/packageB/jest.config.ts
import { Config } from "@jest/types"
import { jestPackageConfig } from "@elmijo/monorepo-helper"

export default {
  ...jestPackageConfig({ projectDir: __dirname }),
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
} as Config.InitialOptions
```

**Project**

```ts
// jest.config.ts
import { Config } from "@jest/types"
import { jestRootConfig } from "@elmijo/monorepo-helper"

export default {
  ...jestRootConfig({ packageRepos: ["./packages"] })
  watchman: false
} as Config.InitialOptions
```

## Documentation

(https://elmijo.github.io/monorepo-helper/)[https://elmijo.github.io/monorepo-helper/]
