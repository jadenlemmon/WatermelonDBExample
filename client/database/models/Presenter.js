import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export class Presenter extends Model {
  static table = 'presenters';

  @field('role') role;
  @field('first_name') firstName;
  @field('last_name') lastName;
  @field('bio') bio;

  updatePresenter = async updatedPresenter => {
    await this.update(presenter => {
      presenter.role = updatedPresenter.role;
      presenter.firstName = updatedPresenter.firstName;
      presenter.lastName = updatedPresenter.lastName;
      presenter.bio = updatedPresenter.bio;
    });
  };
}
