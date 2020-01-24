import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export class EventPresenter extends Model {
  static table = 'event_presenter';
  static associations = {
    events: {type: 'belongs_to', key: 'event_id'},
    presenters: {type: 'belongs_to', key: 'presenter_id'},
  };

  @field('event_id') event_id;
  @field('presenter_id') presenter_id;
}
