import { Service } from "@flamework/core";
import { OnCharacterAdd } from "shared/hooks";

@Service({})
export class MovementService implements OnCharacterAdd {
  setupMovement(character: CharacterModel): void {
    const cm = character.WaitForChild("ControllerManager") as ControllerManager;
    const gc = cm?.WaitForChild("GroundController") as GroundController;

    if (!gc) return;

    gc.MoveSpeedFactor *= 2;
  }

  onCharacterAdd(character: CharacterModel): void {
    this.setupMovement(character);
  }
}
