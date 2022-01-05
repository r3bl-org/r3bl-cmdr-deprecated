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
import {
  _also, ConfirmInput, createNewShortcutToActionMap, ShortcutToActionMap, StateHolder,
  UseKeyboardReturnValue, useKeyboardWithMapCached, useStateSafely,
} from "r3bl-ts-utils"
import React, { FC } from "react"

// Types & data classes.
export type HookOutput = {
  answer: StateHolder<string>,
  useKeyboard: UseKeyboardReturnValue,
  greeting: string
}
export type HookInput = { name: string }

type InternalProps = { ctx: HookOutput }

// Hooks.
const runHooks = (input: HookInput): HookOutput => {
  const { name } = input
  const app = useApp()
  const [ answer, setAnswer ] = useStateSafely<string>("").asArray()
  
  const createShortcuts = (): ShortcutToActionMap => {
    return _also(
      createNewShortcutToActionMap(),
      map => map
        .set("q", app.exit)
        .set("ctrl+q", app.exit)
    )
  }
  return {
    greeting: `Hello ${name}`,
    answer: new StateHolder(answer, setAnswer),
    useKeyboard: useKeyboardWithMapCached(createShortcuts)
  }
}

// Function components.
export const App: FC = () => {
  const ctx: HookOutput = runHooks({ name: "" })
  return (
    <Box flexDirection="column">
      <Row_Debug ctx={ctx}/>
      <UnicornQuestion ctx={ctx}/>
    </Box>
  )
}

const Row_Debug: FC<InternalProps> =
  ({ ctx }) => {
    const { keyPress: kp, inRawMode: mode } = ctx.useKeyboard
    return mode ?
      <Text color="magenta">keyPress: {kp ? `${kp.toString()}` : "n/a"}</Text> :
      <Text color="gray">keyb disabled</Text>
  }

const UnicornQuestion: FC<InternalProps> =
  ({ ctx }) => {
    const [ text, setText ] = ctx.answer.asArray()
    
    const onSubmit = (answer: boolean) => {
      setText(answer ? "You love unicorns :)" : "You don't like unicorns :(")
    }
    
    return (
      <Box flexDirection="column">
        <Text>Do you like unicorns? (Y/n)</Text>
        
        <ConfirmInput
          placeholderBeforeSubmit="Type y/n, then press enter to submit"
          placeholderAfterSubmit="Thank you"
          defaultValue={false}
          onSubmit={onSubmit}
        />
        
        <Text>Your answer: {text}</Text>
      </Box>
    )
  }


// Main.
render(<App/>)
