import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firestore} from 'firebase';
import {first} from 'rxjs/operators';
import {games, GameService} from 'src/app/services/game.service';
import {Game} from 'types';

const LIMIT = 10;

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.page.html',
  styleUrls: ['./game-history.page.scss'],
})
export class GameHistoryPage {
  games: Game[];
  roomId: string;
  infiniteScrollDisabled = true;

  constructor(
      private readonly gameService: GameService,
      private readonly route: ActivatedRoute,
  ) {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.reset();
  }

  async reset() {
    // reset and reload
    this.infiniteScrollDisabled = true;
    delete this.games;
    await this.loadMore();
  }

  /**
   * Load more games starting from the game game we know about
   * @param event An Ionic CustomEvent for infinite scroll
   */
  async loadMore(event?) {
    // determine startAfter from the last game in thge collection
    let startAfter = undefined;
    if (this.games && this.games.length) {
      startAfter = this.games[this.games.length - 1].completedAt;
    }

    // fetch LIMIT more games
    const moreGames =
        await this.gameService.getCompletedGames(this.roomId, LIMIT, startAfter)
            .pipe(first())
            .toPromise();

    // instantiate the games array if undefined
    if (this.games === undefined) this.games = [];

    // push all new games into this array
    for (const game of moreGames) {
      this.games.push(game);
    }

    // tell infinite scroll to complete
    if (event) {
      event.target.complete();
    }

    if (moreGames.length === 0) {
      // when there are no more games loaded, disable infinite scroll
      this.infiniteScrollDisabled = true;
    } else if (moreGames.length === 1) {
      // when only one was loaded, load more immediately to prevent a weird case
      // where only one game is emitted on the observable on the first request
      this.loadMore();
    } else {
      // otherwise, re-enable infinite scroll
      this.infiniteScrollDisabled = false;
    }
  }

  async migrate() {
    let num = 0;
    let unique = {};
    const db = firestore();
    const batch = db.batch();
    for (const game of games) {
      num++;
      batch.set(
          db.collection('games').doc(`migrated-${game.completedAt}`), game);

      if (!unique[game.completedAt]) {
        unique[game.completedAt] = true;
      } else {
        console.log(game.completedAt);
      }
    }

    console.log(`${num} games to set, ${Object.keys(unique).length} unique`);
    await batch.commit();
    console.log('all done');
  }
}
