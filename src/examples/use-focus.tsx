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

import { Box, Newline, render, Text, useApp, useFocus, useFocusManager } from "ink"
import {
  _also,
  _let,
  Cache,
  createCache,
  createNewKeyPressesToActionMap,
  KeyboardInputHandlerFn,
  makeReactElementFromArray,
  processKeyPress,
  useKeyboard,
  UserInputKeyPress,
} from "r3bl-ts-utils"
import React, { FC } from "react"

//#region Main functional component.
const UseFocusExample: FC = function (): JSX.Element {
  const [keyPress, inRawMode] = useKeyboard(
    onKeyPress.bind({ app: useApp(), focusManager: useFocusManager() })
  )

  return (
    <Box flexDirection="column">
      {keyPress && <Row_Debug inRawMode={inRawMode} keyPress={keyPress.toString()} />}
      <Row_Instructions />
      <Row_FocusableItems />
    </Box>
  )
}
//#endregion

//#region Local cache.
const cache: Cache<string, Map<string[], () => void>> = createCache(
  "cache",
  10,
  "least-frequently-used"
)
//#endregion

//#region Keypress handler.
const onKeyPress: KeyboardInputHandlerFn = function (
  this: { app: ReturnType<typeof useApp>; focusManager: ReturnType<typeof useFocusManager> },
  keyPress: UserInputKeyPress
) {
  const { app, focusManager } = this
  const { exit } = app
  const { focus } = focusManager

  _let(cache.getAndComputeIfAbsent("keyPressesToActionMap", createActionMap), (map) => {
    processKeyPress(keyPress, map)
  })

  function createActionMap(): Map<string[], () => void> {
    console.log("createActionMap - cache miss!")
    return _also(createNewKeyPressesToActionMap(), (map) => {
      map.set(["q", "ctrl+q"], exit)
      map.set(["!"], focus.bind(undefined, "1"))
      map.set(["@"], focus.bind(undefined, "2"))
      map.set(["#"], focus.bind(undefined, "3"))
    })
  }
}
//#endregion

//#region UI.

function Row_Debug(props: { inRawMode: boolean; keyPress: string | undefined }) {
  const { keyPress, inRawMode } = props
  return inRawMode ? (
    <>
      <Text color={"magenta"}>keyPress: {keyPress}</Text>
    </>
  ) : (
    <Text>keyb disabled</Text>
  )
}

const Row_Instructions: FC = function (): JSX.Element {
  return makeReactElementFromArray(
    [
      ["blue", "Press Tab to focus next element"],
      ["blue", "Shift+Tab to focus previous element"],
      ["blue", "Esc to reset focus."],
      ["green", "Press Shift+<n> to directly focus on 1st through 3rd item."],
      ["red", "To exit, press Ctrl+q, or q"],
    ],
    (item: string[], id: number): JSX.Element => (
      <Text color={item[0]} key={id}>
        {item[1]}
      </Text>
    )
  )
}

const Row_FocusableItems: FC = function (): JSX.Element {
  return (
    <Box padding={1} flexDirection="row" justifyContent={"space-between"}>
      <FocusableItem id="1" label="First" />
      <FocusableItem id="2" label="Second" />
      <FocusableItem id="3" label="Third" />
    </Box>
  )
}

const FocusableItem: FC<{ label: string; id: string }> = function ({ label, id }): JSX.Element {
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

render(<UseFocusExample />)
