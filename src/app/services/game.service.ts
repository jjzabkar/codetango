import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {firestore} from 'firebase';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Game, GameStatus, TeamTypes, TileRole} from 'types';

@Injectable({providedIn: 'root'})
export class GameService {
  constructor(
      private readonly afs: AngularFirestore,
  ) {}

  createGame(game: Partial<Game>) {
    const createdAt = Date.now();
    return this.afs.collection('games').add({createdAt, ...game});
  }

  updateGame(id: string, game: Partial<any>) {
    return this.afs.collection('games').doc(id).update(game);
  }

  removePlayerFromGame(gameId: string, userIdToRemove: string) {
    return this.afs.collection('games').doc(gameId).update({
      'redTeam.userIds': firestore.FieldValue.arrayRemove(userIdToRemove),
      'blueTeam.userIds': firestore.FieldValue.arrayRemove(userIdToRemove),
    });
  }

  addPlayerToTeam(
      gameId: string, playerId: string, team: 'redTeam'|'blueTeam') {
    const oppositeTeam = team === 'redTeam' ? 'blueTeam' : 'redTeam';
    return this.afs.collection('games').doc(gameId).update({
      [`${team}.userIds`]: firestore.FieldValue.arrayUnion(playerId),
      [`${oppositeTeam}.userIds`]: firestore.FieldValue.arrayRemove(playerId),
    });
  }

  assignSpymaster(
      gameId: string, playerId: string, team: 'redTeam'|'blueTeam') {
    return this.afs.collection('games').doc(gameId).update({
      [`${team}.spymaster`]: playerId,
    });
  }

  getGame(gameId: string): Observable<Game> {
    return this.afs.collection('games')
        .doc<Game>(gameId)
        .snapshotChanges()
        .pipe(map(game => {
          return {id: game.payload.id, ...game.payload.data()};
        }));
  }

  getCurrentGame(roomId: string): Observable<Game|null> {
    return this.afs
        .collection<Game>(
            'games',
            ref => {
              return ref.where('roomId', '==', roomId)
                  .orderBy('createdAt', 'desc')
                  .limit(1);
            })
        .snapshotChanges()
        .pipe(map(games => {
          if (!games || !games.length) {
            return null;
          }

          const {doc} = games[0].payload;
          return {id: doc.id, ...doc.data()};
        }));
  }

  getCompletedGames(roomId: string, limit?: number, startAfter?: number):
      Observable<Game[]> {
    return this.afs
        .collection<Game>(
            'games',
            ref => {
              let query = ref.where('roomId', '==', roomId)
                              .orderBy('completedAt', 'desc');

              // support limiting
              if (limit) {
                query = query.limit(limit);
              }

              // start after a given completedAt timestamp
              if (startAfter) {
                query = query.startAfter(startAfter);
              }

              return query;
            })
        .snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const {doc} = action.payload;
            return {id: doc.id, ...doc.data()};
          });
        }));
  }

  getUserGames(userId: string, limit?: number): Observable<Game[]> {
    return this.afs
        .collection<Game>(
            'games',
            ref => {
              let query = ref.where('userIds', 'array-contains', userId)
                              .orderBy('completedAt', 'asc');

              // support limiting
              if (limit) {
                query = query.limit(limit);
              }

              return query;
            })
        .snapshotChanges()
        .pipe(map(actions => {
          return actions.map(action => {
            const {doc} = action.payload;
            return {id: doc.id, ...doc.data()};
          });
        }));
  }

  deleteGame(id: string): Promise<void> {
    return this.afs.collection('games').doc(id).delete();
  }
}

export const games: Game[] = [

];


// MIGRATED FROM HERE ON DOWN
export const migrated: Game[] = [
  // MARCH 19TH
  {
    blueTeam: {
      spymaster: 'KyleSammons',
      color: TeamTypes.BLUE,
      userIds: [
        'KyleSammons',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
      ],
    },
    redTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.RED,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Stephanie',
      ],
    },
    blueAgents: 3,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [
      {word: 'ROUNDABOUT', role: TileRole.BLUE, selected: true},
      {word: 'THROUGH', role: TileRole.BLUE, selected: true},
      {word: 'MOP', role: TileRole.RED, selected: false},
      {word: 'HAPPY', role: TileRole.RED, selected: false},
      {word: 'PENDULUM', role: TileRole.RED, selected: false},
      {word: 'MIDSUMMER', role: TileRole.BLUE, selected: false},
      {word: 'HOMEWORK', role: TileRole.BLUE, selected: false},
      {word: 'HANDWRITING', role: TileRole.CIVILIAN, selected: false},
      {word: 'STOPLIGHT', role: TileRole.RED, selected: false},
      {word: 'PROTESTANT', role: TileRole.RED, selected: true},
      {word: 'CHAMPION', role: TileRole.RED, selected: false},
      {word: 'CANDY', role: TileRole.RED, selected: false},
      {word: 'STUDENT', role: TileRole.CIVILIAN, selected: false},
      {word: 'STATE', role: TileRole.CIVILIAN, selected: false},
      {word: 'SIESTA', role: TileRole.CIVILIAN, selected: false},
      {word: 'MAILBOX', role: TileRole.CIVILIAN, selected: true},
      {word: 'CUTICLE', role: TileRole.BLUE, selected: false},
      {word: 'POCKET', role: TileRole.RED, selected: false},
      {word: 'BRIDGE', role: TileRole.BLUE, selected: false},
      {word: 'PENCIL', role: TileRole.BLUE, selected: false},
      {word: 'FIGMENT', role: TileRole.RED, selected: false},
      {word: 'FRANCE', role: TileRole.ASSASSIN, selected: false},
      {word: 'EUREKA', role: TileRole.CIVILIAN, selected: false},
      {word: 'TELEPHONE', role: TileRole.BLUE, selected: false},
      {word: 'LOITERER', role: TileRole.CIVILIAN, selected: false},
    ],
    createdAt: new Date(Date.parse('03/19/20 1:01:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/19/20 1:28:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
      ],
    },
    redTeam: {
      spymaster: 'Stephanie',
      color: TeamTypes.RED,
      userIds: [
        'Stephanie',
        'dOCi9artoJe7311Lpth7LPscHC43',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    blueAgents: 4,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('03/19/20 1:31:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/19/20 1:45:00 pm')).getTime()
  },
  // MARCH 24TH
  {
    blueTeam: {
      spymaster: 'Paul',
      color: TeamTypes.BLUE,
      userIds: [
        'Paul',
        'KyleSammons',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Israel',
        'Bryan',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    redTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.RED,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Stephanie',
        'Kerry',
      ],
    },
    blueAgents: 6,
    redAgents: 4,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('03/24/20 12:33:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/24/20 12:47:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Henry',
      color: TeamTypes.BLUE,
      userIds: [
        'Henry',
        'KyleSammons',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Israel',
        'Paul',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    redTeam: {
      spymaster: 'Kerry',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Stephanie',
        'Kerry',
        'Bryan',
      ],
    },
    blueAgents: 0,
    redAgents: 5,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('03/24/20 12:49:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/24/20 01:06:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Israel',
      color: TeamTypes.BLUE,
      userIds: [
        'Israel',
        'KyleSammons',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Henry',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Stephanie',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('03/24/20 01:08:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/24/20 01:31:00 pm')).getTime()
  },
  // MARCH 31ST
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Josh',
        'Israel',
      ],
    },
    redTeam: {
      spymaster: 'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      color: TeamTypes.RED,
      userIds: [
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Paul',
      ],
    },
    blueAgents: 0,
    redAgents: 6,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('03/31/20 12:49:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/31/20 01:09:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Israel',
      color: TeamTypes.BLUE,
      userIds: [
        'Israel',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      ],
    },
    redTeam: {
      spymaster: 'Josh',
      color: TeamTypes.RED,
      userIds: [
        'Josh',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Paul',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('03/31/20 01:10:00 pm')).getTime(),
    completedAt: new Date(Date.parse('03/31/20 01:26:00 pm')).getTime()
  },
  // APRIL 10TH
  {
    blueTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.BLUE,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],  // Missing screenshot
    createdAt: new Date(Date.parse('04/10/20 12:40:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/10/20 01:00:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      color: TeamTypes.BLUE,
      userIds: [
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 8,
    redAgents: 6,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/10/20 01:01:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/10/20 01:06:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],  // Missing screenshot, canada dry game
    createdAt: new Date(Date.parse('04/10/20 01:08:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/10/20 01:34:00 pm')).getTime()
  },
  // APRIL 14TH
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    redTeam: {
      spymaster: 'KShkSeTCGThWqmcB3M99H8uOijE2',
      color: TeamTypes.RED,
      userIds: [
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 5,
    redAgents: 5,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/14/20 12:35:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/14/20 12:45:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.BLUE,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.RED,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 0,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],  // missing screenshot
    createdAt: new Date(Date.parse('04/14/20 12:46:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/14/20 01:10:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Henry',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/14/20 01:12:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/14/20 01:34:00 pm')).getTime()
  },
  // APRIL 16TH
  {
    blueTeam: {
      spymaster: 'Israel',
      color: TeamTypes.BLUE,
      userIds: [
        'Israel',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'Stephanie',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/16/20 12:35:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/16/20 12:50:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Israel',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    redTeam: {
      spymaster: 'Stephanie',
      color: TeamTypes.RED,
      userIds: [
        'Stephanie',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    blueAgents: 5,
    redAgents: 4,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/16/20 12:51:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/16/20 01:12:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.BLUE,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Israel',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'Stephanie',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 5,
    redAgents: 6,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/16/20 01:14:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/16/20 01:24:00 pm')).getTime()
  },
  // APRIL 21ST
  {
    blueTeam: {
      spymaster: 'Stephanie',
      color: TeamTypes.BLUE,
      userIds: [
        'Stephanie',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'KShkSeTCGThWqmcB3M99H8uOijE2',
      color: TeamTypes.RED,
      userIds: [
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/21/20 12:31:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/21/20 12:47:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      color: TeamTypes.BLUE,
      userIds: [
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'Stephanie',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    blueAgents: 0,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/21/20 12:48:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/21/20 01:05:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Stephanie',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'Henry',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/21/20 01:06:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/21/20 01:45:00 pm')).getTime()
  },
  // APRIL 23RD
  {
    blueTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.BLUE,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'KyleSammons',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/23/20 12:31:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/23/20 12:55:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.BLUE,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'KyleSammons',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 5,
    redAgents: 6,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/23/20 12:56:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/23/20 01:09:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'KyleSammons',
      color: TeamTypes.BLUE,
      userIds: [
        'KyleSammons',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    blueAgents: 5,
    redAgents: 5,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/23/20 01:11:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/23/20 01:21:00 pm')).getTime()
  },
  // APRIL 28TH
  {
    blueTeam: {
      spymaster: '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      color: TeamTypes.BLUE,
      userIds: [
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 8,
    redAgents: 8,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/28/20 12:31:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/28/20 12:35:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      color: TeamTypes.BLUE,
      userIds: [
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 4,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/28/20 12:36:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/28/20 12:53:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 0,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/28/20 12:55:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/28/20 01:31:00 pm')).getTime()
  },
  // APRIL 30TH
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/30/20 12:33:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/30/20 12:53:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 7,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/30/20 12:54:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/30/20 01:11:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.BLUE,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('04/30/20 01:13:00 pm')).getTime(),
    completedAt: new Date(Date.parse('04/30/20 01:35:00 pm')).getTime()
  },
  // MAY 5TH
  {
    blueTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.BLUE,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Josh',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Israel',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/05/20 12:32:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/05/20 12:55:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Josh',
      color: TeamTypes.BLUE,
      userIds: [
        'Josh',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.RED,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Israel',
      ],
    },
    blueAgents: 0,
    redAgents: 5,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/05/20 12:58:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/05/20 01:14:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/05/20 01:20:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/05/20 01:32:00 pm')).getTime()
  },
  // MAY 7TH
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Monica',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.RED,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Stephanie',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    blueAgents: 3,
    redAgents: 6,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/07/20 12:36:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/07/20 12:53:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Monica',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'Stephanie',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/07/20 12:54:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/07/20 01:26:00 pm')).getTime()
  },
  // MAY 12TH
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 0,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/12/20 12:33:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/12/20 01:04:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.BLUE,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'dOCi9artoJe7311Lpth7LPscHC43',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.RED,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/12/20 01:06:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/12/20 01:42:00 pm')).getTime()
  },
  // MAY 14TH
  {
    blueTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.BLUE,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.RED,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/14/20 12:32:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/14/20 12:56:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 2,
    redAgents: 1,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/14/20 12:58:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/14/20 01:24:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'KShkSeTCGThWqmcB3M99H8uOijE2',
      color: TeamTypes.RED,
      userIds: [
        'KShkSeTCGThWqmcB3M99H8uOijE2',
        'Stephanie',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/14/20 01:24:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/14/20 01:52:00 pm')).getTime()
  },
  // MAY 19TH
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Dylan',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Sean',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    blueAgents: 4,
    redAgents: 4,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],  // missing screenshot
    createdAt: new Date(Date.parse('05/19/20 12:36:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/19/20 12:54:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Dylan',
      color: TeamTypes.BLUE,
      userIds: [
        'Dylan',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'Sean',
      color: TeamTypes.RED,
      userIds: [
        'Sean',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    blueAgents: 3,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],  // missing screenshot
    createdAt: new Date(Date.parse('05/19/20 12:58:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/19/20 01:17:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Dylan',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.RED,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'Sean',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/19/20 01:19:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/19/20 01:35:00 pm')).getTime()
  },
  // MAY 21ST
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'Sean',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/21/20 12:33:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/21/20 01:06:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.BLUE,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'Sean',
      color: TeamTypes.RED,
      userIds: [
        'Sean',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/21/20 01:07:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/21/20 01:30:00 pm')).getTime()
  },
  // MAY 26TH
  {
    blueTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.BLUE,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Lee',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'Dylan',
      ],
    },
    blueAgents: 4,
    redAgents: 1,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/26/20 12:32:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/26/20 12:53:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'Lee',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.RED,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'Dylan',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/26/20 12:54:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/26/20 01:15:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Lee',
      color: TeamTypes.BLUE,
      userIds: [
        'Lee',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'Dylan',
      color: TeamTypes.RED,
      userIds: [
        'Dylan',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/26/20 01:17:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/26/20 01:38:00 pm')).getTime()
  },
  // MAY 28TH
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Lee',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Sean',
        'Patrick',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 4,
    redAgents: 5,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/28/20 12:33:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/28/20 12:50:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Patrick',
      color: TeamTypes.BLUE,
      userIds: [
        'Patrick',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Lee',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Sean',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 3,
    redAgents: 4,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/28/20 12:56:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/28/20 01:09:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Lee',
      color: TeamTypes.BLUE,
      userIds: [
        'Lee',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Sean',
        'Patrick',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.RED,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'RN23Ivjpb7hFN3z4yBolHJnKADd2',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('05/28/20 01:11:00 pm')).getTime(),
    completedAt: new Date(Date.parse('05/28/20 01:38:00 pm')).getTime()
  },
  // JUNE 2ND
  {
    blueTeam: {
      spymaster: 'Lee',
      color: TeamTypes.BLUE,
      userIds: [
        'Lee',
        'Josh',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 3,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/02/20 12:33:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/02/20 12:54:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.BLUE,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'Lee',
        'Josh',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    redTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.RED,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/02/20 12:56:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/02/20 01:18:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.BLUE,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Lee',
        'Josh',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    blueAgents: 0,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/02/20 01:19:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/02/20 01:37:00 pm')).getTime()
  },
  // JUNE 4TH
  {
    blueTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.BLUE,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'Patrick',
        'Israel',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    redTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.RED,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/04/20 12:37:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/04/20 12:58:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Israel',
      color: TeamTypes.BLUE,
      userIds: [
        'Israel',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    redTeam: {
      spymaster: 'Patrick',
      color: TeamTypes.RED,
      userIds: [
        'Patrick',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    blueAgents: 6,
    redAgents: 4,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/04/20 12:59:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/04/20 01:10:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.BLUE,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    redTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.RED,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'Patrick',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    blueAgents: 4,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/04/20 01:11:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/04/20 01:26:00 pm')).getTime()
  },
  // JUNE 9TH
  {
    blueTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.BLUE,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 8,
    redAgents: 6,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/09/20 12:35:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/09/20 12:41:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 2,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/09/20 12:46:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/09/20 01:09:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.BLUE,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.RED,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/09/20 01:11:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/09/20 01:33:00 pm')).getTime()
  },
  // JUNE 11TH
  {
    blueTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.BLUE,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'Patrick',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    blueAgents: 8,
    redAgents: 8,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/11/20 12:32:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/11/20 12:37:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'Patrick',
      color: TeamTypes.BLUE,
      userIds: [
        'Patrick',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.RED,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    blueAgents: 1,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/11/20 12:39:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/11/20 01:00:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'Patrick',
        '8cKVyZrZOdfiaMDwdAQwVQyPjwm2',
      ],
    },
    redTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.RED,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/11/20 01:01:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/11/20 01:27:00 pm')).getTime()
  },
  // JUNE 16TH
  {
    blueTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.BLUE,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Sean',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Lee',
      ],
    },
    blueAgents: 4,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/16/20 12:34:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/16/20 12:55:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      color: TeamTypes.BLUE,
      userIds: [
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Sean',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'Lee',
      ],
    },
    blueAgents: 0,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/16/20 12:56:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/16/20 01:19:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    redTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.RED,
      userIds: [
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 3,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/16/20 01:20:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/16/20 01:45:00 pm')).getTime()
  },
  // JUNE 18TH
  {
    blueTeam: {
      spymaster: 'Dylan',
      color: TeamTypes.BLUE,
      userIds: [
        'Dylan',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.RED,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/18/20 12:35:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/18/20 12:59:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Dylan',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      ],
    },
    blueAgents: 6,
    redAgents: 6,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/18/20 01:01:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/18/20 01:08:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.BLUE,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'Dylan',
      ],
    },
    redTeam: {
      spymaster: 'sQYndNihzeP8duvwiJjUFvO3Ckx2',
      color: TeamTypes.RED,
      userIds: [
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 3,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/18/20 01:10:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/18/20 01:27:00 pm')).getTime()
  },
  // JUNE 23RD
  {
    blueTeam: {
      spymaster: 'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      color: TeamTypes.BLUE,
      userIds: [
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
      color: TeamTypes.RED,
      userIds: [
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      ],
    },
    blueAgents: 1,
    redAgents: 2,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/23/20 12:34:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/23/20 01:02:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.BLUE,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    redTeam: {
      spymaster: 'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      color: TeamTypes.RED,
      userIds: [
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
        'iw6pV4i9vcceJkX1m9HTUbIKYFv1',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      ],
    },
    blueAgents: 1,
    redAgents: 0,
    status: GameStatus.RED_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/23/20 01:04:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/23/20 01:33:00 pm')).getTime()
  },
  // JUNE 25TH
  {
    blueTeam: {
      spymaster: 'NShg129LtWXFFqWq3VhW1SfzvVd2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    redTeam: {
      spymaster: 'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
      color: TeamTypes.RED,
      userIds: [
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
        'VhrRDXndF5hW7kLvyhxYMBSTwYq1',
      ],
    },
    blueAgents: 0,
    redAgents: 3,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/25/20 12:35:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/25/20 12:56:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      color: TeamTypes.BLUE,
      userIds: [
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      ],
    },
    redTeam: {
      spymaster: 'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
      color: TeamTypes.RED,
      userIds: [
        'EB6AJ6AXo9WATlzgmqqr0M2vhhE2',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'dOCi9artoJe7311Lpth7LPscHC43',
      ],
    },
    blueAgents: 0,
    redAgents: 5,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/25/20 12:57:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/25/20 01:22:00 pm')).getTime()
  },
  {
    blueTeam: {
      spymaster: 'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
      color: TeamTypes.BLUE,
      userIds: [
        'nmosnaUIA2gXtm7PCKkhWlGrzEu2',
        'sQYndNihzeP8duvwiJjUFvO3Ckx2',
        'bVBSOeWBI4bJGIJNpbTf6MpCgbS2',
      ],
    },
    redTeam: {
      spymaster: 'dOCi9artoJe7311Lpth7LPscHC43',
      color: TeamTypes.RED,
      userIds: [
        'dOCi9artoJe7311Lpth7LPscHC43',
        'RBy1pYAbPTb7SAzDDbYbwHXqVDJ3',
        'NShg129LtWXFFqWq3VhW1SfzvVd2',
      ],
    },
    blueAgents: 0,
    redAgents: 1,
    status: GameStatus.BLUE_WON,
    roomId: 'tangocard',
    tiles: [],
    createdAt: new Date(Date.parse('06/25/20 01:23:00 pm')).getTime(),
    completedAt: new Date(Date.parse('06/25/20 01:44:00 pm')).getTime()
  },
];