import { Controller, OnStart } from "@flamework/core";
import { atom } from "@rbxts/charm";

@Controller({})
export class CharacterStateController {
  public atoms = {
    Crouch: atom(false),
  };
}
