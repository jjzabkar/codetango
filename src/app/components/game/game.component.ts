import {Component, Input} from '@angular/core';
import {get} from 'lodash';
import {AuthService} from 'src/app/services/auth.service';
import {GameService} from 'src/app/services/game.service';
import {RoomService} from 'src/app/services/room.service';
import {UtilService} from 'src/app/services/util.service';
import {Clue, Game, GameStatus, Room, RoomStatus, TeamTypes} from 'types';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  @Input() room: Room;
  @Input() game: Game;
  @Input() selectedTab: string;
  @Input() currentClue: Clue;

  constructor(
      private readonly authService: AuthService,
      private readonly gameService: GameService,
      private readonly roomService: RoomService,
      private readonly utilService: UtilService,
  ) {}

  // Do not allow a player to click when:
  // 1) There is no game
  // 2) The game is over
  // 3) It's not their turn
  // 4) There isn't a clue for their turn
  get disableGameBoard(): boolean {
    return !this.game ||
      !!this.game.completedAt ||
      !this.myTurn ||
      !this.currentClueIsFromMyTeam;
  }

  get currentClueIsFromMyTeam(): boolean {
    if (this.currentClue) {
      return this.myTeam === this.currentClue.team;
    }
    return false;
  }

  get myTeam(): TeamTypes {
    const {currentUserId} = this.authService;
    if (get(this.game, 'redTeam.userIds').includes(currentUserId)) {
      return TeamTypes.RED;
    }
    if (get(this.game, 'blueTeam.userIds').includes(currentUserId)) {
      return TeamTypes.BLUE;
    }
    return TeamTypes.OBSERVER;
  }

  get disableEndTurn(): boolean {
    return !this.game || !!this.game.completedAt || !this.myTurn;
  }

  get myTurn(): boolean {
    const {currentUserId} = this.authService;
    return get(this.game, 'redTeam.userIds').includes(currentUserId) &&
        get(this.game, 'status') === GameStatus.REDS_TURN ||
        get(this.game, 'blueTeam.userIds').includes(currentUserId) &&
        get(this.game, 'status') === GameStatus.BLUES_TURN;
  }

  get spymaster(): boolean {
    const {currentUserId} = this.authService;
    return get(this.game, 'redTeam.spymaster') === currentUserId ||
        get(this.game, 'blueTeam.spymaster') === currentUserId;
  }

  endCurrentTeamsTurn() {
    const updates: Partial<Game> = {};

    if (this.game.status === GameStatus.REDS_TURN) {
      updates.status = GameStatus.BLUES_TURN;
    } else {
      updates.status = GameStatus.REDS_TURN;
    }

    // set the timer if one exists
    if (this.room.timer) {
      updates.turnEnds = Date.now() + (this.room.timer * 1000);
    }

    this.gameService.updateGame(this.game.id, updates);
  }

  async backToLobby() {
    let doIt = true;

    // if game is in progress, doouble check before proceeding
    if (!this.game.completedAt) {
      doIt = await this.utilService.confirm(
          'Are you sure you want to pick new teams?',
          'New Teams',
          'Nevermind',
      );
    }

    if (doIt) {
      const loader = await this.utilService.presentLoader('Redirecting...');
      await this.roomService.updateRoom(this.room.id, {
        status: RoomStatus.PREGAME,
      });
      await loader.dismiss();
    }
  }

  async nextGame() {
    let doIt = true;

    // if game is in progress, doouble check before proceeding
    if (!this.game.completedAt) {
      doIt = await this.utilService.confirm(
          'Are you sure you want to start a new game?',
          'New Game',
          'Nevermind',
      );
    }

    if (doIt) {
      const loader =
          await this.utilService.presentLoader('Creating the next game...');
      const {redTeam, blueTeam, roomId} = this.game;

      // cycle the current spymaster to the end and set new ones
      redTeam.userIds.push(redTeam.userIds.shift());
      blueTeam.userIds.push(blueTeam.userIds.shift());
      redTeam.spymaster = redTeam.userIds[0];
      blueTeam.spymaster = blueTeam.userIds[0];

      await this.gameService.createGame({redTeam, blueTeam, roomId});
      await this.roomService.updateRoom(
          roomId, {status: RoomStatus.ASSIGNING_ROLES});
      await loader.dismiss();
    }
  }
}
