import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  role: 'user' | 'admin' | null;

  @Column('varchar')
  sex: 'male' | 'female';

  @Column('boolean')
  active: boolean;
}

export { User };
