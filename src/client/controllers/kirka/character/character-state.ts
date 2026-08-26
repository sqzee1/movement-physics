import { Controller } from "@flamework/core";
import { atom } from "@rbxts/charm";

@Controller({})
export class CharacterStateController {
  public atoms = {
    Crouch: atom(false),
    HumanoidState: atom<Enum.HumanoidStateType>(Enum.HumanoidStateType.None),
  };

  public resetState() {
    this.atoms.Crouch(false);
    this.atoms.HumanoidState(Enum.HumanoidStateType.None);
  }
}
