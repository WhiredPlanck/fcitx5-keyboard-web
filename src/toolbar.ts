import ChevronLeft from 'bundle-text:../svg/chevron-left.svg'
import Clipboard from 'bundle-text:../svg/clipboard.svg'
import CursorMove from 'bundle-text:../svg/cursor-move.svg'
import Ellipsis from 'bundle-text:../svg/ellipsis.svg'
import Undo from 'bundle-text:../svg/undo.svg'
import { setDisplayMode } from './display'
import { disable, div, enable, handleClick, press, release, renderToolbarButton, setSvgStyle } from './util'
import { redo, sendEvent, undo } from './ux'

let isUndoEnabled: boolean = true
let isRedoEnabled: boolean = true
let undoButton: HTMLElement | null = null
let redoButton: HTMLElement | null = null

export function enableUndo(enabled: boolean) {
  isUndoEnabled = enabled
  if (undoButton)
    enabled ? enable(undoButton) : disable(undoButton)
}

export function enableRedo(enabled: boolean) {
  isRedoEnabled = enabled
  if (redoButton)
    enabled ? enable(redoButton) : disable(redoButton)
}

function renderDisableButton(icon: string, enabled: () => boolean) {
  const button = div('fcitx-keyboard-toolbar-button')
  button.innerHTML = icon
  const touchStart = () => enabled() && press(button)
  const touchEnd = () => release(button)
  button.addEventListener('touchstart', touchStart)
  button.addEventListener('touchend', touchEnd)
  button.addEventListener('touchcancel', touchEnd)
  return button
}

export function renderToolbar() {
  const toolbar = div('fcitx-keyboard-toolbar')

  undoButton = renderDisableButton(Undo, () => isUndoEnabled)
  handleClick(undoButton, () => isUndoEnabled && undo())

  redoButton = renderDisableButton(Undo, () => isRedoEnabled)
  redoButton.style.transform = 'scaleX(-1)'
  handleClick(redoButton, () => isRedoEnabled && redo())

  const editButton = renderToolbarButton(CursorMove)
  handleClick(editButton, () => setDisplayMode('edit'))

  const clipboardButton = renderToolbarButton(Clipboard)

  const statusAreaButton = renderToolbarButton(Ellipsis)
  handleClick(statusAreaButton, () => setDisplayMode('statusArea'))

  const collapseButton = renderToolbarButton(ChevronLeft)
  handleClick(collapseButton, () => sendEvent({ type: 'COLLAPSE' }))
  setSvgStyle(collapseButton, { transform: 'rotate(270deg)' })

  for (const button of [undoButton, redoButton, editButton, clipboardButton, statusAreaButton, collapseButton]) {
    toolbar.appendChild(button)
  }
  return toolbar
}
