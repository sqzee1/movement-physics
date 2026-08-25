import { RawInput } from "@rbxts/mechanism";

export const enum ActionID {
  Crouch,
}

export const Keybinds = {
  [ActionID.Crouch]: ["C"],
} satisfies Record<ActionID, RawInput[]>;
