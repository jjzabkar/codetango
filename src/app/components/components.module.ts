import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {CluesComponent} from './clues/clues.component';
import {GameBoardComponent} from './game-board/game-board.component';
import {GameJoinButtonComponent} from './game-join-button/game-join-button.component';
import {GameComponent} from './game/game.component';
import {PregameComponent} from './pregame/pregame.component';
import {UsersComponent} from './users/users.component';

@NgModule({
  declarations: [
    GameBoardComponent,
    GameComponent,
    CluesComponent,
    UsersComponent,
    GameJoinButtonComponent,
    PregameComponent,
    UsersComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    GameBoardComponent,
    GameComponent,
    CluesComponent,
    UsersComponent,
    GameJoinButtonComponent,
    PregameComponent,
    UsersComponent,
  ]
})
export class ComponentsModule {
}
