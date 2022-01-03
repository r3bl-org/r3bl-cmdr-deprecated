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

import { Box, Text } from "ink"
import {
  _also, createNewShortcutToActionMap, LifecycleHelper, ShortcutToActionMap, TTYSize,
  useClockWithLocalTimeFormat, UseKeyboardReturnValue, useKeyboardWithMapCached,
  usePreventProcessExitDuringTesting, useTTYSize
} from "r3bl-ts-utils"
import React, { FC } from "react"

//#region Hooks.

interface HooksOutput {
  ttySize: TTYSize
  formattedTime: string
  greeting: string
  useKeyboard: UseKeyboardReturnValue
}

interface HooksInput {
  name: string
}

const runHooks = (inputs: HooksInput): HooksOutput => {
  const { name } = inputs
  
  usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
  const ttySize: TTYSize = useTTYSize()
  const { localeTimeString: formattedTime } = useClockWithLocalTimeFormat(3_000)
  
  return {
    greeting: `Hello ${name}`,
    ttySize,
    formattedTime,
    useKeyboard: useKeyboardWithMapCached(createShortcutsMap)
  }
}

//#endregion

//#region handleKeyboard.

const createShortcutsMap = (): ShortcutToActionMap => _also(
  createNewShortcutToActionMap(),
  map => map
    .set("q", LifecycleHelper.fireExit)
    .set("ctrl+q", LifecycleHelper.fireExit)
    .set("escape", LifecycleHelper.fireExit)
)

//#endregion

//#region render().

export const App: FC<{ name: string }> = ({ name }) => {
  const { greeting, useKeyboard, ttySize, formattedTime } = runHooks({ name })
  const { keyPress, inRawMode } = useKeyboard
  return (
    <Box flexDirection={"column"}>
      <Text>
        Hello <Text color="yellow">{greeting}</Text>
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
