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

import * as ink from "ink"
import { Box, Text, useApp } from "ink"
import {
  _also, createNewKeyPressesToActionMap, KeyBindingsForActions, TextColor, useKeyboardWithMap,
  UserInputKeyPress,
} from "r3bl-ts-utils"
import React, { createElement, FC, useMemo } from "react"

//#region Main function component.

const functionComponent: FC = () => render(runHooks())

//#endregion

//#region runHooks.

interface RenderContext {
  keyPress: UserInputKeyPress | undefined
  inRawMode: boolean
}

const runHooks = (): RenderContext => {
  const app = useApp()
  const map: KeyBindingsForActions = useMemo(() => createShortcutsMap(app), [])
  const { keyPress, inRawMode } = useKeyboardWithMap(map)
  return { keyPress, inRawMode }
}

//#endregion

//#region handleKeyboard.

const createShortcutsMap = (app: ReturnType<typeof useApp>): KeyBindingsForActions => _also(
  createNewKeyPressesToActionMap(),
  map => map
    .set([ "q", "ctrl+q" ], app.exit)
    .set([ "x", "ctrl+x" ], app.exit)
)

//#endregion

//#region render().

const render = (ctx: RenderContext) => {
  const { keyPress, inRawMode } = ctx
  return (
    <Box flexDirection="column">
      {keyPress && <Row_Debug inRawMode={inRawMode} keyPress={keyPress.toString()}/>}
      <Text>{TextColor.builder.rainbow.build()("Your example goes here!")}</Text>
    </Box>
  )
}

//#endregion

//#region UI.

const Row_Debug: FC<{ inRawMode: boolean; keyPress: string | undefined }> = ({
  keyPress,
  inRawMode,
}): JSX.Element => inRawMode ? (
  <Text color="magenta">keyPress: {keyPress}</Text>
) : (
  <Text color="gray">keyb disabled</Text>
)

//#endregion

ink.render(createElement(functionComponent))
