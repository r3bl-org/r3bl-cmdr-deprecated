import {
  _also, backspaceKey, deleteKey, downKey, leftKey, pageDownKey, pageUpKey, returnKey, rightKey,
  tabKey, UserInputKeyPress
} from "r3bl-ts-utils"

export const keyCodeMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("[D", new UserInputKeyPress(leftKey, undefined))
      .set("[C", new UserInputKeyPress(rightKey, undefined))
      .set("[A", new UserInputKeyPress(rightKey, undefined))
      .set("[B", new UserInputKeyPress(downKey, undefined))
      .set("[6~", new UserInputKeyPress(pageDownKey, undefined))
      .set("[5~", new UserInputKeyPress(pageUpKey, undefined))
  }
)

export const keySequenceMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("7F", new UserInputKeyPress(backspaceKey, undefined))
      .set("[3~", new UserInputKeyPress(deleteKey, undefined))
      .set("\r", new UserInputKeyPress(returnKey, undefined))
      .set("\t", new UserInputKeyPress(tabKey, undefined))
  }
)

export const keyNameMap = _also(
  new Map<string, UserInputKeyPress>(),
  map => {
    map
      .set("backspace", new UserInputKeyPress(backspaceKey, undefined))
      .set("delete", new UserInputKeyPress(deleteKey, undefined))
      .set("return", new UserInputKeyPress(returnKey, undefined))
      .set("tab", new UserInputKeyPress(tabKey, undefined))
  }
)
