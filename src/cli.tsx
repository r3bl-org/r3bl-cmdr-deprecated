#!/usr/bin/env node

/*
 * Copyright (c) 2021-2022 R3BL LLC. All rights reserved.
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

import { Command } from "commander"
import { render } from "ink"
import { _let, LifecycleHelper, TimerRegistry } from "r3bl-ts-utils"
import { createElement } from "react"
import { App } from "./app"

//#region Parse command line args.

const processCommandLineArgs = (): CommandLineArgs => _let(
  new Command(),
  (it) => {
    it.option("-n, --name <name>", "name to display")
    it.parse(process.argv)
    return it.opts()
  }
)

interface CommandLineArgs {
  name: string | undefined
}

//#endregion

//#region render ink app.

/**
 * render() returns an instance of Ink that can be used to unmount(), waitUntilExit(), etc.
 * `React.createElement(app, { name })` is almost the same as `<App name={name} />`, except that
 * the JSX *requires* the functional or class component to start w/ an uppercase character.*/
const createInkApp = (args: CommandLineArgs): ReturnType<typeof render> => {
  const { name } = args
  return render(
    createElement(App, { name: !name ? "Stranger" : name })
  )
}

//#endregion

//#region main().

const main = () => {
  const args = processCommandLineArgs()
  const instance = createInkApp(args)
  LifecycleHelper.addExitListener(() => {
    instance.waitUntilExit()
      .then(() => {
        console.log("Exiting ink")
      })
      .catch(() => {
        console.error("Problem with exiting ink")
      })
    TimerRegistry.killAll()
    instance.unmount()
  })
}

main()

//#endregion
