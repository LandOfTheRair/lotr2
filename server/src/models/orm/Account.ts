
import { Entity, IEntity, PrimaryKey, Property } from 'mikro-orm';
import { ObjectID } from 'mongodb';

import { IAccount, ICharacter } from '../../interfaces';

@Entity()
export class Account implements IAccount {

  @PrimaryKey() _id: ObjectID;

  @Property() username!: string;
  @Property() password!: string;
  @Property() email!: string;
  @Property() players: ICharacter[] = [];

}

export interface Account extends IEntity<string> {}
