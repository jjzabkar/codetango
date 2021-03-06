import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {GameService} from 'src/app/services/game.service';

import {Game, GameStatus, Room, Tile, TileRole} from '../../../../types';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
  // readonly versions of the game board won't user the room
  @Input() room?: Room;

  @Input() game: Game;
  @Input() readonly: boolean;
  @Input() spymaster: boolean;

  constructor(
      private readonly authService: AuthService,
      private readonly gameService: GameService,
  ) {}

  getColor(tile: Tile): string {
    if (!tile.selected) {
      return 'light';
    } else {
      switch (tile.role) {
        case TileRole.ASSASSIN:
          return 'dark';
        case TileRole.CIVILIAN:
          return 'warning';
        case TileRole.BLUE:
          return 'primary';
        case TileRole.RED:
          return 'danger';
      }
    }
  }

  selectTile(tile: Tile) {
    tile.selected = true;
    tile.selectedBy = this.authService.currentUserId;

    const updates: Partial<Game> = {
      tiles: this.game.tiles,
      status: this.getGameStatus(tile),
    };

    // set completedAt when the assassin is clicked
    if (tile.role === TileRole.ASSASSIN) {
      updates.completedAt = Date.now();
    }

    // set the timer if one exists
    if (this.room && this.room.timer && updates.status !== this.game.status) {
      updates.turnEnds = Date.now() + (this.room.timer * 1000);
    }

    this.gameService.updateGame(this.game.id, updates);
  }

  getGameStatus(tile: Tile) {
    const bluesTurn = this.game.status === GameStatus.BLUES_TURN;
    switch (tile.role) {
      case TileRole.ASSASSIN:
        return bluesTurn ? GameStatus.RED_WON : GameStatus.BLUE_WON;
      case TileRole.CIVILIAN:
        return bluesTurn ? GameStatus.REDS_TURN : GameStatus.BLUES_TURN;
      case TileRole.BLUE:
        return GameStatus.BLUES_TURN;
      case TileRole.RED:
        return GameStatus.REDS_TURN;
      default:
        throw 'What the fuck is this?!';
    }
  }
}
