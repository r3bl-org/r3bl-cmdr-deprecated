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
import TextInput from "ink-text-input"
import _ from "lodash"
import {
  _also, _let, createNewKeyPressesToActionMap, SetState, StateHook, TextColor,
  UseKeyboardReturnType, useKeyboardWithMap, useStateIfMounted,
} from "r3bl-ts-utils"
import React, { createElement, FC, ReactElement, useEffect, useMemo } from "react"

let DEBUG = true
let count = 0

namespace types {
  export class State {
    showInput = true
    textInput = ""
    toString = () => JSON.stringify(this)
  }
  
  export type StateHolder = { state: State, setState: SetState<State>, uid: string }
  
  export type Context = StateHolder & UseKeyboardReturnType
}

namespace hooks {
  export function run(): types.Context {
    const app = useApp()
    
    const [ state, setState ]: StateHook<types.State> = useStateIfMounted(new types.State())
    
    const createShortcuts = (): ReturnType<typeof createNewKeyPressesToActionMap> =>
      _also(
        createNewKeyPressesToActionMap(),
        map => map
          .set([ "q", "ctrl+q" ], app.exit)
          .set([ "x", "ctrl+x" ], app.exit)
      )
    
    const useKeyboardReturnValue: ReturnType<typeof useKeyboardWithMap> =
      _let(
        useMemo(createShortcuts, []),
        useKeyboardWithMap
      )
    
    return {
      state, setState, ...useKeyboardReturnValue,
      uid: `${count++}`
    }
  }
}

/**
 * Don't define a variable in the "global" scope of the namespace. There should be no local
 * variables that are defined since they can have issues w/ React function component state. For eg,
 * `ctx` should not be defined globally but only inside the `Root` function component.
 */
namespace app {
  export const main = () => <Root/>
  
  const Root: FC = () => {
    const ctx: types.Context = hooks.run()
    
    // Debug.
    DEBUG && useEffect(() => {
      const text = `${ctx.uid}, ${ctx.state}, ${ctx.keyPress}`
      const randomColor: TextColor = _.sample([
        new TextColor().red,
        new TextColor().yellow,
        new TextColor().cyan,
        new TextColor().green,
        new TextColor().magenta,
        new TextColor().grey,
      ])!
      console.log(randomColor.applyFormatting(text))
    })
    
    const { state } = ctx
    const text: string = TextColor.builder.cyan.underline.bold.build()(state.textInput)
    return (
      <Box flexDirection="column">
        <RowDebug ctx={ctx}/>
        {state.showInput ? <UseTextInput ctx={ctx}/> : <Text>{text}</Text>}
      </Box>
    )
  }
  
  type Props = { ctx: types.Context }
  const RowDebug: FC<Props> = ({ ctx }) => {
    const { keyPress, inRawMode } = ctx
    return inRawMode ?
      <Text color="magenta">keyPress: {keyPress ? `${keyPress}` : "n/a"}</Text> :
      <Text color="gray">keyb disabled</Text>
  }
  
  const UseTextInput: FC<Props> = ({ ctx }) => {
    const { state, setState } = ctx
    return _let(
      useStateIfMounted(""),
      ([ query, setQuery ]: StateHook<string>): ReactElement =>
        <Box flexDirection="column">
          <Box flexDirection="row" marginRight={1}>
            <Text color={"red"}>Enter your query: </Text>
            <TextInput
              placeholder="Type something & press enter when done, or q to exit"
              value={query}
              onChange={setQuery}
              onSubmit={() => setState({ ...state, showInput: false, textInput: query })}
            />
          </Box>
          <Text>You typed: {TextColor.builder.america.bold.build()(query)}</Text>
        </Box>
    )
  }
}

const Wrapper: FC = () =>
  <>
    {app.main()}
    {app.main()}
  </>

render(createElement(Wrapper))