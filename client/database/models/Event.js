import {Model, Q} from '@nozbe/watermelondb';
import {field, lazy} from '@nozbe/watermelondb/decorators';

export class Event extends Model {
  static table = 'events';
  static associations = {
    event_presenter: {type: 'has_many', foreignKey: 'event_id'},
  };

  @field('name') name;

  @lazy
  presenters = this.collections
    .get('presenters')
    .query(Q.on('event_presenter', 'event_id', this.id));
}
