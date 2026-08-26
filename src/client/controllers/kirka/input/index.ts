import { Controller } from "@flamework/core";
import { OnInput, OnInputDeactivated } from "client/decorators";
import { CharacterController } from "../character";
import { CharacterStateController } from "../character/character-state";
import { MovementController } from "../character/movement";
import { ActionID, Keybinds } from "./keybinds";

@Controller({})
export class InputController {
  constructor(
    private state: CharacterStateController,
    private character: CharacterController,
    private movement: MovementController,
  ) {}

  @OnInput(Keybinds[ActionID.Crouch])
  onCrouch() {
    if (!this.character.get()) return;
    this.state.atoms.Crouch(true);
  }

  @OnInputDeactivated(Keybinds[ActionID.Crouch])
  onCrouchDeactivated() {
    if (!this.character.get()) return;

    this.state.atoms.Crouch(false);
  }

  @OnInput(Keybinds[ActionID.Jump])
  onJump() {
    if (!this.character.get()) return;
    this.movement.onSpacePressed();
  }
}
