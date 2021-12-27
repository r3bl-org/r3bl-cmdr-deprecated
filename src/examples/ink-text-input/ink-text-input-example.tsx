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
import {
  _also, _let, createNewKeyPressesToActionMap, StateHolder, TextColor, UseKeyboardReturnType,
  useKeyboardWithMap, useStateSafely,
} from "r3bl-ts-utils"
import React, { createElement, FC, ReactElement, useEffect, useMemo } from "react"

let DEBUG = true
let count = 0

namespace types {
  export class MyState {
    showInput = true
    textInput = ""
    toString = () => JSON.stringify(this)
  }
  
  export type Context = UseKeyboardReturnType & {
    stateHolder: StateHolder<MyState>
    uid: string
  }
}

namespace hooks {
  import Context = types.Context
  import MyState = types.MyState
  
  export function run(): Context {
    const app = useApp()
    
    const stateHolder: StateHolder<MyState> = useStateSafely(new MyState())
    
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
      stateHolder,
      ...useKeyboardReturnValue,
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
  import Context = types.Context
  
  export const createComponent = () => <Root/>
  
  const Root: FC = () => {
    const ctx: Context = hooks.run()
    
    // Debug.
    DEBUG && useEffect(() => {
      const text = `${ctx.uid}, ${ctx.stateHolder.value}, ${ctx.keyPress}`
      console.log(TextColor.builder.randomFgColor.build()(text))
    })
    
    const { stateHolder } = ctx
    const text: string = TextColor.builder.cyan.underline.bold.build()(stateHolder.value.textInput)
    return (
      <Box flexDirection="column">
        <RowDebug ctx={ctx}/>
        {stateHolder.value.showInput ? <UseTextInput ctx={ctx}/> : <Text>{text}</Text>}
      </Box>
    )
  }
  
  type Props = { ctx: Context }
  const RowDebug: FC<Props> = ({ ctx }) => {
    const { keyPress, inRawMode } = ctx
    return inRawMode ?
      <Text color="magenta">keyPress: {keyPress ? `${keyPress}` : "n/a"}</Text> :
      <Text color="gray">keyb disabled</Text>
  }
  
  const UseTextInput: FC<Props> = ({ ctx }) =>
    _let(
      useStateSafely(""),
      ({ value: query, setValue: setQuery }: StateHolder<string>): ReactElement =>
        <Box flexDirection="column">
          <Box flexDirection="row" marginRight={1}>
            <Text color={"red"}>Enter your query: </Text>
            <TextInput
              placeholder="Type something & press enter when done, or q to exit"
              value={query}
              onChange={setQuery}
              onSubmit={() => ctx.stateHolder.setValue({
                ...ctx.stateHolder.value,
                showInput: false,
                textInput: query
              })}
            />
          </Box>
          <Text>You typed: {TextColor.builder.america.bold.build()(query)}</Text>
        </Box>
    )
}

const Wrapper: FC = () =>
  <>
    {app.createComponent()}
    {app.createComponent()}
  </>

render(createElement(Wrapper))