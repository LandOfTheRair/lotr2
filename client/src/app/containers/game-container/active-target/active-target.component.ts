import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';

import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, Subscription } from 'rxjs';
import { ICharacter } from '../../../../interfaces';
import { GameState } from '../../../../stores';

import { GameService } from '../../../services/game.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-active-target',
  templateUrl: './active-target.component.html',
  styleUrls: ['./active-target.component.scss']
})
export class ActiveTargetComponent implements OnInit, OnDestroy {

  @Select(GameState.player) player$: Observable<ICharacter>;
  @Select(GameState.currentTarget) currentTarget$: Observable<ICharacter>;

  public player: ICharacter;
  public target: ICharacter;

  playerSub: Subscription;
  targetSub: Subscription;

  public get isInFOV(): boolean {
    if (!this.player || !this.target) return false;

    const diffX = this.target.x - this.player.x;
    const diffY = this.target.y - this.player.y;

    if (!this.player.fov) return false;
    if (!this.player.fov[diffX]) return false;
    if (!this.player.fov[diffX][diffY]) return false;

    return true;
  }

  public get shouldShow() {
    return this.player && this.target && this.target.hp.__current > 0 && this.isInFOV; // TODO: can see stealth here
  }

  public get targetHealth() {
    return ((this.target.hp.__current / this.target.hp.maximum) * 100).toFixed(2);
  }

  public get hostility() {
    return this.gameService.hostilityLevelFor(this.player, this.target);
  }

  public get isDifficult() {
    return this.target.level > this.player.level + 5;
  }

  public get direction() {
    return this.gameService.directionTo(this.player, this.target);
  }

  public get effects() {
    if (!this.target) return [];

    return [
      ...this.target.effects.buff,
      ...this.target.effects.debuff,
      ...this.target.effects.incoming,
      ...this.target.effects.outgoing
    ];
  }

  constructor(
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.playerSub = this.player$.subscribe(p => this.player = p);
    this.targetSub = this.currentTarget$.subscribe(t => this.target = t);
  }

  ngOnDestroy() {}

}
