import { Controller } from "@flamework/core";
import { Player } from "client/utility/utility";
import { AIR_SPEED_MAX, AIR_SPEED_STANDING, GROUND_ACCELERATION_TIME, GROUND_DECELERATION_TIME } from "../constants/character";

@Controller({})
export class PhysicsController {
  public getCM(): Maybe<ControllerManager> {
    const character = Player.Character;
    if (!character) return;
    return character.FindFirstChildOfClass("ControllerManager");
  }

  public getGC(): Maybe<GroundController> {
    const cm = this.getCM();
    if (!cm) return;
    return cm.FindFirstChildOfClass("GroundController");
  }

  public getAC(): Maybe<AirController> {
    const cm = this.getCM();
    if (!cm) return;
    return cm.FindFirstChildOfClass("AirController");
  }

  public getAirSpeedFactor(): number {
    const ac = this.getAC();
    return ac ? ac.MoveSpeedFactor : AIR_SPEED_STANDING;
  }

  public setAirSpeedFactor(factor: number): void {
    const ac = this.getAC();
    if (!ac) return;
    ac.MoveSpeedFactor = math.clamp(factor, 0, AIR_SPEED_MAX);
  }

  public getMovingDirection(): Vector3 {
    const cm = this.getCM();
    return cm ? cm.MovingDirection : Vector3.zero;
  }

  public setMovingDirection(direction: Vector3): void {
    const cm = this.getCM();
    if (!cm) return;
    cm.MovingDirection = direction;
  }

  public isAirborne(): boolean {
    const cm = this.getCM();
    if (!cm) return false;
    return cm.ActiveController === this.getAC();
  }

  public setupGroundController(): void {
    const gc = this.getGC();
    if (!gc) return;

    gc.AccelerationTime = GROUND_ACCELERATION_TIME;
    gc.DecelerationTime = GROUND_DECELERATION_TIME;
  }

  public reset(): void {
    this.setAirSpeedFactor(AIR_SPEED_STANDING);
    this.setupGroundController();
  }
}
