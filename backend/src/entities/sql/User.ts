import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CONN_SQL } from "../../db";

@Entity({ database: CONN_SQL })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true, type: "character varying" })
  ethnicity: string | null = null;

  @Column({ type: "decimal", nullable: true })
  gpa: number | null = null;

  @Column({ nullable: true, type: "integer" })
  satScore: number | null = null;
}
