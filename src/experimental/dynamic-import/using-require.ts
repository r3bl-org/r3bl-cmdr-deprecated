/* eslint-disable */

/*
 * Copyright (c) 2022 R3BL LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
