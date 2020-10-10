import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export default class Forum {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column({ nullable: false })
  name!: string;
}
