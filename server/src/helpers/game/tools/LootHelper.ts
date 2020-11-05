
import { Injectable } from 'injection-js';
import { LootTable } from 'lootastic';

import { BaseService, IItem, ItemClass } from '../../../interfaces';

@Injectable()
export class LootHelper extends BaseService {

  constructor(
    // private holidayHelper: HolidayHelper
    // private content: ContentManager
  ) {
    super();
  }

  public init() {}

  chooseWithReplacement(choices: any[], number = 1) {
    if (choices.length === 0) return [];
    const table = new LootTable(choices);
    return table.chooseWithReplacement(number);
  }

  chooseWithoutReplacement(choices: any[], number = 1) {
    if (choices.length === 0) return [];
    const table = new LootTable(choices);
    return table.chooseWithoutReplacement(number);
  }

  isItemValueStackable(item: IItem): boolean {
    return item.itemClass === ItemClass.Coin;
  }

  // TODO: copy loot-helper.ts to here, rewrite as necessary, figure out how to link npc to the map so droptables are accessible

  /*
  private filterDropTable(dropTable: any[]) {
    return dropTable.filter(item => item.requireHoliday ? this.holidayHelper.isHoliday(item.requireHoliday) : true);
  }
  */

}