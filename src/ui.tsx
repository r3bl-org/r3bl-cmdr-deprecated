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

import { Box, Text, useApp } from "ink"
import {
  _also, createNewKeyPressesToActionMap, KeyBindingsForActions, TTYSize,
  useClockWithLocalTimeFormat, useKeyboardWithMap, usePreventProcessExitDuringTesting,
  UserInputKeyPress, useTTYSize,
} from "r3bl-ts-utils"
import React, { FC, useMemo } from "react"

//#region App functional component.

export const appFn: FC<{ name: string }> = ({ name }) => render(runHooks(name))

//#endregion

//#region Hooks.

interface RenderContext {
  ttySize: TTYSize
  inRawMode: boolean
  formattedTime: string
  name: string
  keyPress: UserInputKeyPress | undefined
}

const runHooks = (name: string) => {
  usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
  const ttySize: TTYSize = useTTYSize()
  const { localeTimeString: formattedTime } = useClockWithLocalTimeFormat(3_000)
  
  const app = useApp()
  const map: KeyBindingsForActions = useMemo(
    () => createKeyBindingsForActionsMap({ app }),
    []
  )
  const [ keyPress, inRawMode ] = useKeyboardWithMap(map)
  
  return {
    name,
    ttySize,
    formattedTime,
    inRawMode,
    keyPress
  }
}

//#endregion

//#region handleKeyboard.

type CreateActionMapContext = {
  app: ReturnType<typeof useApp>
}

const createKeyBindingsForActionsMap = (ctx: CreateActionMapContext): KeyBindingsForActions => {
  console.log("createActionMap - cache miss!")
  return _also(
    createNewKeyPressesToActionMap(),
    (map) => {
      const { app } = ctx
      map.set([ "q", "ctrl+q", "escape" ], app.exit)
    }
  )
}

//#endregion

//#region render().

const render = (args: RenderContext) => {
  const { keyPress, name, inRawMode, ttySize, formattedTime } = args
  return (
    <Box flexDirection={"column"}>
      <Text>
        Hello <Text color="yellow">{name}</Text>
      </Text>
      <Text>
        {inRawMode ?
          <Text color="green">inRawMode</Text> :
          <Text color="red">!inRawMode</Text>
        }
      </Text>
      <Text>
        ttySize <Text color="blue">{ttySize.toString()}</Text>
      </Text>
      <Text>
        time <Text color="magenta">{formattedTime}</Text>
      </Text>
      <Text>
        {keyPress ?
          <Text color="cyan">{keyPress.toString()}</Text> :
          <Text color="red">!keyPress</Text>
        }
      </Text>
    </Box>
  )
}

//#endregion
