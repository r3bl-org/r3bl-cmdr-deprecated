/*
 * Copyright (c) 2021 R3BL LLC. All rights reserved.
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

namespace nodejs_keypress_doesnt_work {
  // Use Node.js API to capture keypress.
  const stdin = process.stdin
  
  // Raw mode means we would only get events once enter is pressed.
  stdin.setRawMode(true)
  
  // Resume stdin in the parent process (node app won't quit all by itself unless an error or
  // process.exit() happens).
  stdin.resume()
  
  // The data events will not emit binary, but utf-8.
  stdin.setEncoding("utf8")
  
  // Display whatever the user types.
  stdin.on("keypress", function (chunk, key) {
    process.stdout.write("Chunk:" + chunk + "\n")
    process.stdout.write("Key:" + key + "\n")
    
    if (key && key.ctrl && key.name == "c") process.exit()
  })
}
