# Rocket.Chat Apps Engine
The engine which manages and controls everything....more details coming soon.

## Thoughts While Working (for docs)
- Apps which don't provide a valid uuid4 id will be assigned one, but this is not recommended and your App should provide an id
- The language strings are only done on the clients (`TAPi18next.addResourceBundle(lang, projectName, translations);`)
- The implementer of this should restrict the server setting access and environmental variables. Idea is to allow the implementer to have a default set of restricted ones while letting the admin/owner of the server to restrict it even further or lift the restriction on some more. Simple interface with settings and checkbox to allow/disallow them. :thinking:

## To Think About?
- Will we support es6? Since we currently check `extends` keyword and can check `implements` via determing what methods exist
- Using https://www.npmjs.com/package/jsonc-parser for the json parsing?

## Implementer Needs to Implement:
- `src/server/storage/AppStorage`
- `src/server/storage/AppLogStorage`
- `src/server/bridges/*`

## Testing Framework:
Makes great usage of TypeScript and decorators: https://github.com/alsatian-test/alsatian/wiki
* To run the tests do: `npm run unit-tests`
* To generate the coverage information: `npm run check-coverage`
* To view the coverage: `npm run view-coverage`
