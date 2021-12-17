#!/usr/bin/env node

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

//#region Imports.

import { Command } from "commander"
import { render } from "ink"
import { _also, _let, TimerRegistry } from "r3bl-ts-utils"
import { createElement } from "react"
import { appFn } from "./ui"

//#endregion

//#region Parse command line args.

const name: string =
  _let(
    new Command(),
    (command) => {
      command.option("-n, --name <name>", "name to display")
      command.parse(process.argv)
      const options = command.opts()
      return options["name"] as string
    }
  )

//#endregion

//#region render ink app.

/**
 * 1. render() returns an instance of Ink that can be used to unmount(), waitUntilExit(), etc.
 * 2. `React.createElement(app, { name })` is almost the same as `<App name={name} />`, except that
 *    the JSX *requires* the functional or class component to start w/ an uppercase character.
 */
_also(
  render(createElement(appFn, { name: !name ? "Stranger" : name })),
  (ink) => {
    ink.waitUntilExit()
      .then(() => {
        TimerRegistry.killAll()
      })
      .catch(() => {
        console.error("Problem with exiting ink")
      })
  }
)

//#endregion
