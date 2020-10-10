import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import User from "./User";

@Entity()
export default class UserInterests {
  @ManyToOne(() => User, (user) => user.interests, {
    lazy: true,
    primary: true,
    cascade: true,
  })
  user!: User;

  @Column({ primary: true })
  interest!: string;
}
