import { Controller, OnStart } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import { Players, RunService } from "@rbxts/services";
import { Player } from "client/utility/utility";
import { promisifyEvent } from "shared/utils/promises";
import { MovementController } from "./movement";

@Controller({})
export class CharacterController implements OnStart {
  private bin = new Bin();

  constructor(private movement: MovementController) {}

  public get(): Maybe<Model> {
    return Player.Character;
  }

  public async waitFor(): Promise<CharacterModel> {
    return promisifyEvent<[model: CharacterModel]>(Players.LocalPlayer.CharacterAdded).then(([model]) => model);
  }

  onStart() {
    this.bin.add(
      RunService.PreAnimation.Connect((dt: number) => {
        this.movement.update(dt);
      }),
    );
  }

  public destroy() {
    this.bin.destroy();
  }
}
