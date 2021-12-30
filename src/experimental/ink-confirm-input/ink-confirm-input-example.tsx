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
import {
  _also, _let, createNewKeyPressesToActionMap, StateHolder, UseKeyboardReturnType,
  useKeyboardWithMap, useStateSafely,
} from "r3bl-ts-utils"
import { KeyBindingsForActions } from "r3bl-ts-utils/src/react-ink-hook-utils/use-keyboard"
import React, { FC, useMemo } from "react"
import { ConfirmInput } from "./ink-confirm-input"

// Types & data classes.
export type Context =
  { answer: StateHolder<string> }
  & ReturnType<typeof useKeyboardWithMap>

type Props = { ctx: Context }

// Hooks.
const runHooks = (): Context => {
  const [ answer, setAnswer ] = useStateSafely<string>("").asArray()
  
  return {
    ...runUseKeyboard(),
    answer: new StateHolder(answer, setAnswer)
  }
}

const runUseKeyboard = (): UseKeyboardReturnType => {
  const app = useApp()
  
  // The return value of this function is cached by useMemo.
  const createShortcuts = (): KeyBindingsForActions => {
    return _also(
      createNewKeyPressesToActionMap(),
      map => map.set([ "q", "ctrl+q" ], app.exit)
    )
  }
  
  return _let(
    useMemo(createShortcuts, []), // Cache value.
    useKeyboardWithMap // Pass cached value to hook & return its return value.
  )
}

// Function components.
export const App: FC = () => {
  const ctx: Context = runHooks()
  return (
    <Box flexDirection="column">
      <Row_Debug ctx={ctx}/>
      <UnicornQuestion ctx={ctx}/>
    </Box>
  )
}

const Row_Debug: FC<Props> =
  ({ ctx }) => {
    const { keyPress: kp, inRawMode: mode } = ctx
    return mode ?
      <Text color="magenta">keyPress: {kp ? `${kp.toString()}` : "n/a"}</Text> :
      <Text color="gray">keyb disabled</Text>
  }

const UnicornQuestion: FC<Props> =
  ({ ctx }) => {
    const handleAnswer = (value: boolean) => ctx.answer.setValue(
      value ? "You love unicorns :)" : "You don't like unicorns :(")
    
    return (
      <Box flexDirection="column">
        <Text>Do you like unicorns? (Y/n)</Text>
        
        <ConfirmInput
          placeholder="Type y/n, then press enter to submit"
          placeholderAfterSubmit="Thank you"
          defaultValue={false}
          onAnswer={handleAnswer}
        />
        
        <Text>Your answer: {ctx.answer.toString()}</Text>
      </Box>
    )
  }


// Main.
render(<App/>)
