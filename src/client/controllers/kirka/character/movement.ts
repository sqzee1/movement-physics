import { Controller } from "@flamework/core";
import { OnPreAnimation } from "client/hook-managers/hooks";
import { OnPreSimulation } from "shared/hooks";
import { AIR_SPEED_CROUCH_PENALTY, AIR_SPEED_MAX, AIR_SPEED_STANDING, LANDING_PERFECT_WINDOW, LANDING_WINDOW } from "../constants/character";
import { CharacterStateController } from "./character-state";
import { PhysicsController } from "./physics";

interface JumpRecord {
  startedCrouched: boolean;
  rearmed: boolean;
  landedAt: number;
}

@Controller({})
export class MovementController implements OnPreAnimation {
  private airborne = false;
  private jumpStartCrouched = false;
  private releasedInAir = false;
  private rearmedInAir = false;
  private lastSpacePressAt = 0;
  private lastJump?: JumpRecord;
  private jumpDirection = Vector3.zero;

  constructor(
    private state: CharacterStateController,
    private physics: PhysicsController,
  ) {}

  private resolveAir(record?: JumpRecord) {
    if (!record || !record.startedCrouched) {
      this.applyStandingJump();
      return;
    }

    const delta = math.abs(this.lastSpacePressAt - record.landedAt);
    if (record.rearmed && delta <= LANDING_WINDOW) {
      this.applyBoostedJump(delta);
      return;
    }

    if (this.jumpStartCrouched) {
      this.applyCrouchPenaltyJump();
      return;
    }

    this.applyStandingJump();
  }

  private applyStandingJump() {
    this.physics.setAirSpeedFactor(AIR_SPEED_STANDING);
  }

  private applyCrouchPenaltyJump() {
    this.physics.setAirSpeedFactor(AIR_SPEED_CROUCH_PENALTY);
  }

  private applyBoostedJump(delta: number) {
    if (delta <= LANDING_PERFECT_WINDOW) {
      this.physics.setAirSpeedFactor(AIR_SPEED_MAX);
      return;
    }

    const falloff = (delta - LANDING_PERFECT_WINDOW) / (LANDING_WINDOW - LANDING_PERFECT_WINDOW);
    this.physics.setAirSpeedFactor(AIR_SPEED_MAX - (AIR_SPEED_MAX - AIR_SPEED_STANDING) * falloff);
  }

  public onPreAnimation() {
    if (!this.airborne) return;
    this.physics.setMovingDirection(this.jumpDirection);
  }

  public onSpacePressed() {
    this.lastSpacePressAt = os.clock();
  }

  public onHumanoidStateChanged(newState: Enum.HumanoidStateType) {
    if (newState === Enum.HumanoidStateType.Jumping || newState === Enum.HumanoidStateType.Freefall) {
      if (this.airborne) return;

      this.airborne = true;
      this.jumpDirection = this.physics.getMovingDirection();

      this.jumpStartCrouched = this.state.atoms.Crouch();
      this.releasedInAir = false;
      this.rearmedInAir = !this.jumpStartCrouched;

      this.resolveAir(this.lastJump);
      this.lastJump = undefined;
      return;
    }

    if (newState === Enum.HumanoidStateType.Landed || newState === Enum.HumanoidStateType.Running) {
      if (!this.airborne) return;

      this.airborne = false;
      this.lastJump = {
        startedCrouched: this.jumpStartCrouched,
        rearmed: this.rearmedInAir,
        landedAt: os.clock(),
      };
    }
  }

  public onCrouchChanged(active: boolean) {
    if (!this.airborne || !this.jumpStartCrouched) return;

    if (!active && !this.releasedInAir) {
      this.releasedInAir = true;
    } else if (active && this.releasedInAir && !this.rearmedInAir) {
      this.rearmedInAir = true;
    }
  }

  public reset() {
    this.airborne = false;
    this.jumpStartCrouched = false;
    this.releasedInAir = false;
    this.rearmedInAir = false;
    this.lastSpacePressAt = 0;
    this.lastJump = undefined;
    this.jumpDirection = Vector3.zero;
    this.physics.reset();
  }
}
