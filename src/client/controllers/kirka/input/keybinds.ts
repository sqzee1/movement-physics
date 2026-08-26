import { RawInput } from "@rbxts/mechanism";

export const enum ActionID {
  Crouch,
  Jump,
}

export const Keybinds = {
  [ActionID.Crouch]: ["LeftShift"],
  [ActionID.Jump]: ["Space"],
} satisfies Record<ActionID, RawInput[]>;
