import { Controller, OnStart } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import { subscribe } from "@rbxts/charm";
import { Players } from "@rbxts/services";
import { Player } from "client/utility/utility";
import { OnCharacterAdd, OnCharacterRemove } from "shared/hooks";
import { promisifyEvent } from "shared/utils/promises";
import { CharacterStateController } from "./character-state";
import { MovementController } from "./movement";

@Controller({})
export class CharacterController implements OnCharacterAdd, OnCharacterRemove {
  private bin = new Bin();

  constructor(
    private movement: MovementController,
    private state: CharacterStateController,
  ) {}

  public get(): Maybe<Model> {
    return Player.Character;
  }

  public async waitFor(): Promise<CharacterModel> {
    return promisifyEvent<[model: CharacterModel]>(Players.LocalPlayer.CharacterAdded).then(([model]) => model);
  }

  onCharacterAdd(character: CharacterModel): void {
    this.bin.add(subscribe(this.state.atoms.HumanoidState, (newState) => this.movement.onHumanoidStateChanged(newState)));
    this.bin.add(subscribe(this.state.atoms.Crouch, (active) => this.movement.onCrouchChanged(active)));

    this.state.resetState();
    this.movement.reset();

    const humanoid = character.Humanoid;
    this.bin.add(
      humanoid.StateChanged.Connect((_, newState) => {
        this.state.atoms.HumanoidState(newState);
      }),
    );
  }

  onCharacterRemove(character: CharacterModel): void {
    this.destroy();
  }

  public destroy() {
    this.bin.destroy();
  }
}
