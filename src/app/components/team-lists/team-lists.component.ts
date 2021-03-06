import {Component, Input} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {GameService} from 'src/app/services/game.service';

import {Game, Room, RoomStatus} from '../../../../types';

@Component({
  selector: 'app-team-lists',
  templateUrl: './team-lists.component.html',
  styleUrls: ['./team-lists.component.scss'],
})
export class TeamListsComponent {
  @Input() room: Room;
  @Input() game: Game;
  @Input() setSpymaster: boolean;

  constructor(
      private readonly authService: AuthService,
      private readonly gameService: GameService,
  ) {}

  get loggedInAndInRoom(): boolean {
    return this.authService.authenticated && this.room &&
        this.room.userIds.includes(this.authService.currentUserId);
  }

  get notOnATeamYet(): boolean {
    return this.game &&
        !this.game.redTeam.userIds.includes(this.authService.currentUserId) &&
        !this.game.blueTeam.userIds.includes(this.authService.currentUserId);
  }

  showJoinButton(team: 'redTeam'|'blueTeam') {
    return this.loggedInAndInRoom && this.game && !this.game.completedAt &&
        (this.canSwapTeams(team) || this.notOnATeamYet);
  }

  canSwapTeams(team: 'redTeam'|'blueTeam'): boolean {
    return this.game && this.room.status === RoomStatus.ASSIGNING_ROLES &&
        !this.game[team].userIds.includes(this.authService.currentUserId);
  }

  userClicked(userId: string, team: 'redTeam'|'blueTeam') {
    if (this.setSpymaster) {
      this.gameService.assignSpymaster(this.game.id, userId, team);
    }
  }

  joinTeam(team: 'redTeam'|'blueTeam') {
    this.gameService.addPlayerToTeam(
        this.game.id,
        this.authService.currentUserId,
        team,
    );
  }
}
