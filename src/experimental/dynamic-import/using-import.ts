/* eslint-disable */

/**
 * This does not work w/ `node -r tsm`, but it does work if you build it and run the JS files.
 * https://stackoverflow.com/questions/55279762/javascript-dynamically-loading-a-class-and-creating-new-instance-with-specific
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#dynamic-import-expressions
 */

namespace dynamicImport {
  main().catch(console.log)
  
  async function main() {
    const temp = await import("./thing-to-import")
    temp.foo("foo")
  }
}
