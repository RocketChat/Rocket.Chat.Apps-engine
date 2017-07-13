# Rocketlets Server
The core server piece which manages and controls everything.

## Thoughts While Working (for docs)
- Rocketlets which don't provide a valid uuid4 id will be assigned one, but this is not recommended and your Rocketlet should provide an id
- The language strings are only done on the clients
- The implementer of this should restrict the server setting access and environmental variables. Idea is to allow the implementer to have a default set of restricted ones while letting the admin/owner of the server to restrict it even further or lift the restriction on some more. Simple interface with settings and checkbox to allow/disallow them. :thinking:

## To Think About?
- Will we support es6? Since we currently check `extends` keyword and can check `implements` via determing what methods exist

## Implementer Needs to Implement:
- `src/server/storage/RocketletStorage`
- `src/server/bridges/*`
