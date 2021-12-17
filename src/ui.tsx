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

import { Box, Text, useApp, useFocusManager } from "ink"
import {
  _also, createNewKeyPressesToActionMap, KeyBindingsForActions, TTYSize,
  useClockWithLocalTimeFormat, useKeyboardWithMap, usePreventProcessExitDuringTesting, useTTYSize,
} from "r3bl-ts-utils"
import React, { FC, useMemo } from "react"

//#endregion

//#region App functional component.

export const appFn: FC<{ name: string }> = ({ name }) => render.call(runHooks(name))

//#endregion

//#region Hooks.

interface RenderContext {
  ttySize: TTYSize
  inRawMode: boolean
  formattedTime: string
  name: string
}

function runHooks(name: string) {
  usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
  const ttySize: TTYSize = useTTYSize()
  const [ formattedTime ] = useClockWithLocalTimeFormat(10_000)
  
  const map: KeyBindingsForActions = useMemo(
    createActionMap.bind({ app: useApp(), focusManager: useFocusManager() }),
    []
  )
  const [ _, inRawMode ] = useKeyboardWithMap(map)
  
  return {
    name,
    ttySize,
    formattedTime,
    inRawMode,
  }
}

//#endregion

//#region handleKeyboard.

type CreateActionMapContext = {
  app: ReturnType<typeof useApp>
}

function createActionMap(this: CreateActionMapContext): KeyBindingsForActions {
  console.log("createActionMap - cache miss!")
  return _also(
    createNewKeyPressesToActionMap(),
    (map) => {
      const { app } = this
      map.set([ "q", "ctrl+q", "escape" ], app.exit)
    }
  )
}

//#endregion

//#region render().

function render(this: RenderContext) {
  const { name, inRawMode, ttySize, formattedTime } = this
  return (
    <Box flexDirection={"column"}>
      <Text>
        Hello <Text color="yellow">{name}</Text>
      </Text>
      <Text>
        {inRawMode ? <Text color="green">inRawMode</Text> : <Text color="red">!inRawMode</Text>}
      </Text>
      <Text>
        ttySize <Text color="blue">{ttySize.toString()}</Text>
      </Text>
      <Text>
        time <Text color="magenta">{formattedTime}</Text>
      </Text>
    </Box>
  )
}

//#endregion
