# Rocketlets Server
The core server piece which manages and controls everything.

## Thoughts While Working (for docs)
- Rocketlets which don't provide a valid uuid4 id will be assigned one, but this is not recommended and your Rocketlet should provide an id

## To Think About?
- Will we support es6? Since we currently check `extends` keyword and can check `implements` via determing what methods exist

## Implementer Needs to Implement:
- `src/server/storage/RocketletStorage`
- `src/server/bridges/*`
