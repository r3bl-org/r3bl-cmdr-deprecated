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

import TextInput from "ink-text-input"
import { StateHook, useStateSafely } from "r3bl-ts-utils"
import React, { FC } from "react"
import yn from "yn"

interface Props {
  placeholder: string
  placeholderAfterSubmit: string
  defaultValue: boolean // https://stackoverflow.com/a/60817451/2085356
  onAnswer: (value: boolean) => void
}

export const ConfirmInput: FC<Props> =
  ({ defaultValue, onAnswer, placeholder, placeholderAfterSubmit }) => {
    const [ value, setValue ]: StateHook<string> = useStateSafely("").asArray()
    const [ showCursor, setShowCursor ]: StateHook<boolean> = useStateSafely(true).asArray()
    
    const onSubmit = (userInput: string) => {
      onAnswer(yn(userInput, { default: defaultValue }))
      setValue("")
      setShowCursor(false)
    }
    
    const onChange = (userInput: string) => {
      if (userInput.toLowerCase() === "y" || userInput.toLowerCase() === "n") setValue(userInput)
    }
    
    return (
      <TextInput
        showCursor={showCursor}
        placeholder={showCursor ? placeholder : placeholderAfterSubmit}
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    )
  }

