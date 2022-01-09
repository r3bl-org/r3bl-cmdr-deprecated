import { Box, render, Text } from "ink"
import SelectInput from "ink-select-input"
import {
  _also, createNewShortcutToActionMap, Data, LifecycleHelper, ShortcutToActionMap, TextColor,
  TimerRegistry, useKeyboardWithMapCached, UseKeyboardWrapper, useStateSafely
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

const main = async (): Promise<void> => {
  const instance = render(<Wrapper/>)
  
  LifecycleHelper.addExitListener(() => {
    TimerRegistry.killAll()
    instance.unmount()
  })
  
  try {
    await instance.waitUntilExit()
    console.log(TextColor.builder.bgYellow.black.build()("Exiting ink"))
  } catch (err) {
    console.error(TextColor.builder.bgYellow.black.build()("Problem with exiting ink"))
  }
}

main().catch(console.log)
