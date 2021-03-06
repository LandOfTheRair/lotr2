import { Game } from '../../../helpers';
import { IMapScript } from '../../../interfaces';

export class DedlaenMazeScript implements IMapScript {
  readonly name = 'DedlaenMaze';

  setup(game: Game) {

    const darkTiles = [
      [103, 184],
      [104, 184],
      [104, 183],
      [105, 183],
      [106, 183],
      [107, 183],
      [107, 182],
      [108, 182],
      [109, 182],
      [109, 181],
      [110, 181],
      [111, 181],
      [111, 180],
      [112, 180],
      [112, 179],
      [113, 179],
      [113, 178]
    ];

    darkTiles.forEach(([x, y]) => {
      game.darknessHelper.createPermanentDarkness('DedlaenMaze', x, y);
    });


  }

  events() {

  }

  handleEvent(game: Game, event: string, { trigger }) {
    if (event === 'on:swwalltile') {
      game.messageHelper.sendSimpleMessage(trigger, 'You hear a clicking noise.');
      this.toggleDoors(game, true);
    }

    if (event === 'off:swwalltile') {
      this.toggleDoors(game, false);
    }
  }

  private toggleDoors(game: Game, open: boolean) {
    const mapRef = game.worldManager.getMap('DedlaenMaze');

    for (let i = 1; i <= 3; i++) {
      const door = mapRef?.map.findInteractableByName(`Tile Door ${i}`);
      if (open) mapRef?.state.openDoor(door.id);
      else      mapRef?.state.closeDoor(door.id);
    }
  }

}
