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
import TextInput from "ink-text-input"
import {
  _also, _let, createNewKeyPressesToActionMap, SetState, StateHook, TextColor,
  UseKeyboardReturnType, useKeyboardWithMap, UserInputKeyPress, useStateIfMounted,
} from "r3bl-ts-utils"
import React, { createElement, FC, ReactElement, useMemo } from "react"

//#region runHooks.

class State {
  showInput = true
  textInput = ""
}

type RenderContext = {
  state: State,
  setState: SetState<State>
} & UseKeyboardReturnType

const runHooks = (): RenderContext => {
  const app = useApp()
  
  const [ state, setState ]: StateHook<State> = useStateIfMounted(new State())
  
  const createShortcuts = () => _also(
    createNewKeyPressesToActionMap(),
    map => map
      .set([ "q", "ctrl+q" ], app.exit)
      .set([ "x", "ctrl+x" ], app.exit)
  )
  
  const useKeyboardReturnValue: UseKeyboardReturnType =
    _let(
      useMemo(createShortcuts, [ createShortcuts ]),
      useKeyboardWithMap
    )
  
  return { state, setState, ...useKeyboardReturnValue }
}

//#endregion

//#region UI.

const render: (ctx: RenderContext) => ReactElement =
  ({ keyPress, inRawMode, state, setState }) =>
    <Box flexDirection="column">
      {keyPress && rowDebug(inRawMode, keyPress)}
      {
        state.showInput ?
          <UseTextInput state={state} setState={setState}/> :
          <Text>{TextColor.builder.cyan.underline.bold.build()(state.textInput)}</Text>
      }
    </Box>

const rowDebug = (inRawMode: boolean, keyPress: UserInputKeyPress) =>
  inRawMode ? (
    <Text color="magenta">keyPress: {keyPress.toString()}</Text>
  ) : (
    <Text color="gray">keyb disabled</Text>
  )

const UseTextInput: FC<{ state: State, setState: SetState<State> }> =
  ({ state, setState }) => _let(
    useStateIfMounted(""),
    ([ query, setQuery ]) =>
      <Box flexDirection="column">
        <Box flexDirection="row" marginRight={1}>
          <Text color={"red"}>Enter your query: </Text>
          <TextInput
            placeholder="Type something & press enter when done, or q to exit"
            value={query}
            onChange={setQuery}
            onSubmit={() => setState({
              ...state,
              showInput: false,
              textInput: query
            })}
          />
        </Box>
        <Text>You typed: {TextColor.builder.america.bold.build()(query)}</Text>
      </Box>
  )

//#endregion

//#region Main function component.

const functionComponent: FC = () => render(runHooks())
ink.render(createElement(functionComponent))

//#endregion
