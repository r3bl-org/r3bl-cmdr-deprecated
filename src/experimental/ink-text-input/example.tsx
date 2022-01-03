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

import { Box, render, Text, useApp } from "ink"
import TextInput from "ink-text-input"
import {
  _also, _callIfTruthyWithReturn, createNewShortcutToActionMap, ShortcutToActionMap, StateHolder,
  StateHook, TextColor, UseKeyboardReturnValue, useKeyboardWithMapCached, useStateSafely,
} from "r3bl-ts-utils"
import React, { createElement, FC, useEffect } from "react"

/*
 * A new hook `useStateSafely` is needed in this example because when the keyboard shortcut "q" or
 * "ctrl+q" is pressed, it causes the app to exit, and there are still React components mounted,
 * which try and respond to the keypress (eg: `TextInput`) and this causes a runtime exception to be
 * thrown. This doesn't stop the CLI app from exiting, but it does cause an inelegant error message
 * to be dumped on the console, when this happens.
 *
 * Unfortunately, using an event emitter to fire an exit event, and then unmounting (and then
 * waiting for exit & running `process.exit()`) the entire ink app (via an `Instance` reference
 * returned by `render()`) doesn't really solve this problem.
 */

// Constants & types.

const DEBUG = true
let count = 0

class MyState {
  showInput: boolean
  textInput: string
  
  constructor(showInput: boolean = true, textInput: string = "") {
    this.showInput = showInput
    this.textInput = textInput
  }
  
  toString = () => JSON.stringify(this)
}

type HookOutput = {
  useKeyboard: UseKeyboardReturnValue
  stateHolder: StateHolder<MyState>
  uid: string
}

type InternalProps = { ctx: HookOutput }

// Hooks.

export const runHooks = (): HookOutput => {
  const stateHolder: StateHolder<MyState> = useStateSafely(new MyState())
  
  const app = useApp()
  
  const createShortcuts = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map
      .set("q", app.exit)
      .set("ctrl+q", app.exit)
      .set("x", app.exit)
      .set("ctrl+x", app.exit)
  )
  
  return {
    stateHolder,
    useKeyboard: useKeyboardWithMapCached(createShortcuts),
    uid: `${count++}`
  }
}

// Function component.

const Root: FC = () => {
  const ctx: HookOutput = runHooks()
  const { useKeyboard, stateHolder, uid } = ctx
  const { value: myState } = stateHolder
  
  // Debug.
  DEBUG && useEffect(() => {
    const myStateToStr = myState.toString()
    const keyPress = _callIfTruthyWithReturn(
      useKeyboard.keyPress,
      it => it.toString(),
      () => "",
    )
    const text = `${uid}, ${myStateToStr}, ${keyPress}`
    console.log(TextColor.builder.randomFgColor.build()(text))
  })
  
  const text: string = TextColor.builder.cyan.underline.bold.build()(myState.textInput)
  return (
    <Box flexDirection="column">
      <RowDebug ctx={ctx}/>
      {myState.showInput ?
        <UseTextInput ctx={ctx}/> :
        <Text>{text}</Text>}
    </Box>
  )
}

const RowDebug: FC<InternalProps> = ({ ctx }) => {
  const { keyPress, inRawMode } = ctx.useKeyboard
  return inRawMode ?
    <Text color="magenta">keyPress: {keyPress ? `${keyPress.toString()}` : "n/a"}</Text> :
    <Text color="gray">keyb disabled</Text>
}

const UseTextInput: FC<InternalProps> = ({ ctx }) => {
  const [ _, setMyState ] = ctx.stateHolder.asArray()
  const [ text, setText ]: StateHook<string> = useStateSafely("").asArray()
  const onSubmit = () => setMyState(new MyState(false, text))
  
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" marginRight={1}>
        <Text color={"red"}>Enter your query: </Text>
        <TextInput
          placeholder="Type something & press enter when done, or q to exit"
          value={text}
          onChange={setText}
          onSubmit={onSubmit}
        />
      </Box>
      <Text>You typed: {TextColor.builder.america.bold.build()(text)}</Text>
    </Box>
  )
}

const Wrapper: FC = () =>
  <>
    <Root/>
    <Root/>
  </>

render(createElement(Wrapper))