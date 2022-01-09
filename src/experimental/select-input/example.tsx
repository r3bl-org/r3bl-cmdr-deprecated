/*
 * Copyright (c) 2022 R3BL LLC. All rights reserved.
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

import { Box, render, Text } from "ink"
import SelectInput from "ink-select-input"
import {
  _also, createNewShortcutToActionMap, Data, inkCLIAppMainFn, LifecycleHelper, ShortcutToActionMap,
  TextColor, useKeyboardWithMapCached, UseKeyboardWrapper, useStateSafely
} from "r3bl-ts-utils"
import React, { FC } from "react"

// SelectInput example.
class Item extends Data {
  constructor(
    readonly label: string = "",
    readonly value: string = ""
  ) { super() }
}

const App: FC = () => {
  const selection = useStateSafely(new Item())
  const highlight = useStateSafely(new Item())
  const hasFocus = useStateSafely(true)
  
  const onSelect = (item: Item) => {
    selection.setValue(item)
    hasFocus.setValue(false)
  }
  
  const onHighlight = (item: Item) => {
    highlight.setValue(item)
  }
  
  const items: Array<Item> =
    [ new Item("First", "first"), new Item("Second", "second"), new Item("Third", "third") ]
  
  return (
    <Box flexDirection="column">
      <Text color="gray">Selection: {selection.value.toString()}</Text>
      <Text color="magenta">Highlight: {highlight.value.toString()}</Text>
      <Text>
        {hasFocus.value ?
          TextColor.builder.green.build()("hasFocus") :
          TextColor.builder.red.build()("!hasFocus")}
      </Text>
      
      <SelectInput
        isFocused={hasFocus.value}
        items={items}
        onSelect={onSelect}
        onHighlight={onHighlight}
      />
    </Box>)
}

// Main.
const Wrapper: FC = () => {
  const createShortcutsFn = (): ShortcutToActionMap => _also(
    createNewShortcutToActionMap(),
    map => map.set("q", LifecycleHelper.fireExit)
  )
  useKeyboardWithMapCached(createShortcutsFn)
  return (<UseKeyboardWrapper><App/></UseKeyboardWrapper>)
}

// Main.
inkCLIAppMainFn(
  () => render(<Wrapper/>),
  "Exiting ink",
  "Problem w/ exiting ink"
).catch(console.error)
