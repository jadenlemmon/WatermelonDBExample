import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
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
  ],
});
