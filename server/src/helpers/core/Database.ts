
import { Injectable } from 'injection-js';
import { AnyEntity, EntityManager, EntityName, MikroORM, MongoEntity, wrap } from 'mikro-orm';

import { BaseService } from '../../interfaces';

const isProd = process.env.NODE_ENV === 'production';

@Injectable()
export class Database extends BaseService {

  private orm: MikroORM;

  public get em(): EntityManager {
    return this.orm.em;
  }

  public async init() {
    this.orm = await MikroORM.init({
      entitiesDirs: [(isProd ? 'dist' : 'src') + '/models/orm'],
      entitiesDirsTs: ['src/models/orm'],

      clientUrl: process.env.DATABASE_URI,
      dbName: 'landoftherair2',
      type: 'mongo',
      driverOptions: { useUnifiedTopology: true }
    });

    [
      'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(sig => {
      process.on(sig as any, async () => {
        await this.flush();
        process.exit(1);
      });
    });
  }

  public async toObject<T>(entity: AnyEntity<T>) {
    const obj = await wrap(entity);
    return obj.toObject();
  }

  public wrap<T>(entity: AnyEntity<T>) {
    return wrap(entity);
  }

  public async flush() {
    this.em.flush();
  }

  public create<T>(entity: EntityName<T>, data = {}): T {
    return this.em.create(entity, data);
  }

  public save(entity: MongoEntity<any>, delayed = false) {
    return this.em.persist(entity, !delayed);
  }

  public delete(entity: MongoEntity<any>) {
    return this.em.removeEntity(entity, true);
  }

}
