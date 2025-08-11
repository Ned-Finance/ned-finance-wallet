# Hacks

- Using isolate package to deploy because this is a monorepo and app engine doesn't have full support for it
- Copying patches folder after isolate ran because is needed when pnpm install runs in firebase cloud
- Repeating same "resolutions" and "pnpm.patchedDependencies" settings from root package.json to package.json
- Adding all nested local dependencies otherwise throws an error when executing in app engine