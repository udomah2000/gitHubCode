import { userRole } from 'src/enum/role.enum';
import { Base } from './base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Base {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: userRole, default: userRole.member })
  role: userRole;
}
