/* eslint-disable */

/**
 * This works w/ `node -r tsm`, and if you build it and run the JS files.
 * https://stackoverflow.com/questions/55279762/javascript-dynamically-loading-a-class-and-creating-new-instance-with-specific
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html#dynamic-import-expressions
 */

namespace dynamicRequire {
  main()
  
  function main() {
    const temp = require("./thing-to-import")
    temp.foo("foo")
  }
  
}
