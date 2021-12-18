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

import { render } from "ink-testing-library"
import { TimerRegistry } from "r3bl-ts-utils"
import React from "react"
import { appFn } from "../ui"

// ink-testing-library: https://github.com/vadimdemedes/ink-testing-library/blob/master/readme.md

afterEach(TimerRegistry.killAll)

test("renders w/ name props", () => {
  const { lastFrame } = render(React.createElement(appFn, { name: "Grogu" }))
  expect(lastFrame()).toContain("Grogu")
})
