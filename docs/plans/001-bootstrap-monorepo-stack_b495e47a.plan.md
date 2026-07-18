---
name: bootstrap-monorepo-stack
overview: 'Bootstrap a Yarn 4/Turborepo monorepo for Node 24.18.0 with NestJS/SQLite/TypeORM and React/Vite, plus the README-selected code-first GraphQL, UI, and test infrastructure. Keep the repository at infrastructure-only scope: no domain entities, migrations, GraphQL object types/resolvers, components, or feature tests.'
todos:
  - id: root-tooling
    content: Create and install the root Yarn/Turborepo configuration and repository boilerplate.
    status: pending
  - id: api-bootstrap
    content: Scaffold NestJS and configure SQLite/TypeORM plus code-first GraphQL dependencies without schema code.
    status: pending
  - id: web-bootstrap
    content: Scaffold React/Vite and initialize Apollo, Tailwind, shadcn, and test tooling without features.
    status: pending
  - id: docs-verification
    content: Document setup and verify install, lint, typecheck, test, build, and startup behavior.
    status: pending
isProject: false
---

# Bootstrap the monorepo stack

## 1. Establish root tooling and repository conventions

- Add [package.json](package.json) as a private Yarn workspace for `apps/*` and `packages/*`, pin Node `24.18.0` and the resolved Yarn version, install Turborepo/Prettier, and expose root `dev`, `build`, `lint`, `typecheck`, `test`, and formatting scripts.
- Add [turbo.json](turbo.json) with cache outputs for Nest/Vite builds and non-cached persistent development tasks.
- Use Yarn's `node-modules` linker in [.yarnrc.yml](.yarnrc.yml) for native SQLite and broad Nest/Vite tooling compatibility; generate and commit [yarn.lock](yarn.lock).
- Add [.gitignore](.gitignore), [.editorconfig](.editorconfig), [.prettierrc.json](.prettierrc.json), [.prettierignore](.prettierignore), [.nvmrc](.nvmrc), and [.node-version](.node-version), covering dependencies, Turbo/build/test artifacts, environment files, logs, IDE files, and SQLite database sidecars.

## 2. Bootstrap the NestJS API workspace

- Scaffold [apps/api/package.json](apps/api/package.json) and minimal NestJS TypeScript entry/config files, retaining framework bootstrap code only and removing generated sample controller/service behavior.
- Install Nest's standard runtime, lint, Jest, and TypeScript tooling plus `@nestjs/config`, `@nestjs/typeorm`, `typeorm`, and `better-sqlite3`.
- Add the README-selected code-first GraphQL transport dependencies (`@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`, `graphql`, and `graphql-ws`). Preserve TypeScript decorator metadata required by Nest's code-first approach, but defer `GraphQLModule` registration and `autoSchemaFile` generation until a root resolver exists; otherwise Nest cannot generate a valid schema.
- Configure TypeORM infrastructure with an empty entity set, `synchronize: false`, migration-ready paths, and a file-backed `better-sqlite3` database. Add [apps/api/.env.example](apps/api/.env.example), an ignored data directory, and TypeORM CLI scripts, but no entities, migrations, seed data, or schema.

## 3. Bootstrap the React/Vite workspace

- Scaffold [apps/web/package.json](apps/web/package.json) and the React/TypeScript Vite configuration with only the required framework entry shell; remove Vite's counter/logo demonstration content.
- Install Apollo Client, `graphql`, and `graphql-ws` without creating a client, provider, operations, or subscription behavior.
- Initialize Tailwind CSS 4 through the Vite plugin and shadcn/ui configuration, including aliases and utility/config boilerplate, but add no UI components or page styling.
- Install/configure Vitest, jsdom, React Testing Library, and jest-dom with scripts that tolerate the intentionally empty test suite.

## 4. Align documentation and verify the clean bootstrap

- Add a concise setup section to [README.md](README.md) covering Node/Yarn activation, install, environment setup, and workspace commands.
- Run a clean immutable install, formatting checks, lint, type checks, tests, and Turbo builds. Smoke-start both workspaces and confirm the API can initialize an empty SQLite connection without introducing a tracked database file. The database file will be tracked and committed, but at a later date and time.
