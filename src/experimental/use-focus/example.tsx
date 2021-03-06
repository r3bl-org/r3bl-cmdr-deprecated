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

import * as ink from "ink"
import { Box, Newline, Text, useApp, useFocus, useFocusManager } from "ink"
import {
  createNewShortcutToActionMap, KeypressOption, makeReactElementFromArray, ShortcutToActionMap,
  useKeyboardWithMap, _also
} from "r3bl-ts-utils"
import React, { createElement, FC, ReactElement, useMemo } from "react"

//#region Main function component.

const UseFocusExample: FC = () => render(runHooks())

//#endregion

//#region runHooks.

const runHooks = (): Context => {
  const app = useApp()
  const focusManager = useFocusManager()
  const map: ShortcutToActionMap = useMemo(() => createShortcutsMap({ app, focusManager }), [])
  const { keyPress, inRawMode } = useKeyboardWithMap(map)
  return { keyPress, inRawMode }
}

//#endregion

//#region handleKeyboard.

type CreateActionMapContext = {
  app: ReturnType<typeof useApp>
  focusManager: ReturnType<typeof useFocusManager>
}

const createShortcutsMap = (ctx: CreateActionMapContext): ShortcutToActionMap => {
  console.log("createShortcutsMap - cache miss!")
  const { app, focusManager } = ctx
  return _also(
    createNewShortcutToActionMap(),
    map => map
      .set("q", app.exit)
      .set("ctrl+q", app.exit)
      .set("!", focusManager.focus.bind(undefined, "1"))
      .set("@", focusManager.focus.bind(undefined, "2"))
      .set("#", focusManager.focus.bind(undefined, "3"))
  )
}

//#endregion

//#region render().

interface Context {
  keyPress: KeypressOption
  inRawMode: boolean
}

const render = (ctx: Context): ReactElement => {
  const { keyPress, inRawMode } = ctx
  return (
    <Box flexDirection="column">
      {keyPress && <Row_Debug inRawMode={inRawMode} keyPress={keyPress.toString()} />}
      <Row_Instructions />
      <Row_FocusableItems />
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

const Row_Instructions: FC = (): JSX.Element => makeReactElementFromArray(
  [
    [ "blue", "Press Tab to focus next element" ],
    [ "blue", "Shift+Tab to focus previous element" ],
    [ "blue", "Esc to reset focus." ],
    [ "green", "Press Shift+<n> to directly focus on 1st through 3rd item." ],
    [ "red", "To exit, press Ctrl+q, or q" ],
  ],
  (item: string[], id: number): JSX.Element => (
    <Text color={item[ 0 ]} key={id}>
      {item[ 1 ]}
    </Text>
  )
)

const Row_FocusableItems: FC = (): JSX.Element => (
  <Box padding={1} flexDirection="row" justifyContent={"space-between"}>
    <FocusableItem id="1" label="First" />
    <FocusableItem id="2" label="Second" />
    <FocusableItem id="3" label="Third" />
  </Box>
)

const FocusableItem: FC<{ label: string; id: string }> = ({ label, id }): JSX.Element => {
  const { isFocused } = useFocus({ id })
  return (
    <Text>
      {label}
      {isFocused ? (
        <>
          <Newline />
          <Text color="green">(*)</Text>
        </>
      ) : (
        <>
          <Newline />
          <Text color="gray">n/a</Text>
        </>
      )}
    </Text>
  )
}

//#endregion

ink.render(createElement(UseFocusExample))
