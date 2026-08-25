import { Controller } from "@flamework/core";
import { OnInput, OnInputDeactivated } from "client/decorators";
import { CharacterStateController } from "../character/character-state";
import { ActionID, Keybinds } from "./keybinds";

@Controller({})
export class InputController {
  constructor(private characterStateController: CharacterStateController) {}

  @OnInput(Keybinds[ActionID.Crouch])
  onCrouch() {
    this.characterStateController.atoms.Crouch(true);
  }

  @OnInputDeactivated(Keybinds[ActionID.Crouch])
  onCrouchDeactivated() {
    this.characterStateController.atoms.Crouch(false);
  }
}
