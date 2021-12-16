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

import React, { FC } from "react"
import { Box, Text, useApp } from "ink"
import {
  _callIfTrue,
  _let,
  TTYSize,
  useClockWithLocalTimeFormat,
  useKeyboard,
  usePreventProcessExitDuringTesting,
  UserInputKeyPress,
  useTTYSize,
} from "r3bl-ts-utils"

//#region App functional component.
export const appFn: FC<{ name: string }> = ({ name }) => render(runHooks(name))

function runHooks(name: string): LocalVars {
  usePreventProcessExitDuringTesting() // For testing using `npm run start-dev-watch`.
  const ttySize: TTYSize = useTTYSize()
  const [formattedTime] = useClockWithLocalTimeFormat(10_000)
  const inRawMode = _let(useApp(), (it) => {
    const [_, inRawMode] = useKeyboard(onKeyboardFn.bind({ useApp: it }))
    return inRawMode
  })
  return {
    name,
    ttySize,
    formattedTime,
    inRawMode,
  }
}
interface LocalVars {
  ttySize: TTYSize
  inRawMode: boolean
  formattedTime: string
  name: string
}
//#endregion

//#region Handle keyboard input.
/**
 * 🪄 This function implements `KeyboardInputHandlerFn` interface.
 *
 * `this` binds it to an object of type OnKeyboardContext. Since this function is a callback that's
 * executed by Ink itself, it can't make any calls to hooks (like `useApp()` which is why re-binding
 * `this` is needed).
 */
function onKeyboardFn(
  this: {
    useApp: ReturnType<typeof useApp>
  },
  keyPress: UserInputKeyPress
) {
  const { useApp } = this

  _callIfTrue(keyPress.toString() === "ctrl+q", useApp.exit)
  _callIfTrue(keyPress.toString() === "q", useApp.exit)
  _callIfTrue(keyPress.toString() === "escape", useApp.exit)
}
//#endregion

//#region render().
function render(locals: LocalVars) {
  const { name, inRawMode, ttySize, formattedTime } = locals
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
