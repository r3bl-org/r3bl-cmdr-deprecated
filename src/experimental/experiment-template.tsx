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

import { Box, render, Text, useApp } from "ink"
import {
  _also, _let, createNewKeyPressesToActionMap, TextColor, useKeyboardWithMap,
} from "r3bl-ts-utils"
import React, { createElement, FC, useMemo } from "react"

// Types & data classes.

type Context = ReturnType<typeof useKeyboardWithMap>
type Props = { ctx: Context }

// Hooks.

const runHooks = (): Context => {
  const app = useApp()
  
  const createShortcuts = (): ReturnType<typeof createNewKeyPressesToActionMap> =>
    _also(
      createNewKeyPressesToActionMap(),
      map => map
        .set([ "q", "ctrl+q" ], app.exit)
        .set([ "x", "ctrl+x" ], app.exit)
    )
  
  return _let(
    useMemo(createShortcuts, []),
    useKeyboardWithMap
  )
}

// Function component.

const App: FC = () => {
  const ctx = runHooks()
  
  return (
    <Box flexDirection="column">
      <Row_Debug ctx={ctx}/>
      <Text>{TextColor.builder.rainbow.build()("Your example goes here!")}</Text>
    </Box>
  )
}

const Row_Debug: FC<Props> =
  ({ ctx }) => {
    const { keyPress: kp, inRawMode: mode } = ctx
    return mode ?
      <Text color="magenta">keyPress: {kp ? `${kp.toString()}` : "n/a"}</Text> :
      <Text color="gray">keyb disabled</Text>
  }

// Main.

render(createElement(App))
