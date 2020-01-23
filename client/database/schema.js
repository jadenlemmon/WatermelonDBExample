import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
  version: 10,
  tables: [
    tableSchema({
      name: 'presenters',
      columns: [
        {name: 'role', type: 'string'},
        {name: 'first_name', type: 'string'},
        {name: 'last_name', type: 'string'},
        {name: 'bio', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'events',
      columns: [{name: 'name', type: 'string'}],
    }),
    tableSchema({
      name: 'event_presenter',
      columns: [{name: 'event_id', type: 'string'}],
      columns: [{name: 'presenter_id', type: 'string'}],
    }),
  ],
});
