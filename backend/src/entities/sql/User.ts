import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CONN_SQL } from "../../db";

export enum SchoolLevel {
  HS_FRESH = "hs_fresh",
  HS_SOPH = "hs_soph",
  HS_JUNIOR = "hs_junior",
  JS_SENIOR = "hs_senior",

  C_FRESH = "c_fresh",
  C_SOPH = "c_soph",
  C_JUNIOR = "c_junior",
  C_SENIOR = "c_senior",

  NONE = "none",
}

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

  @Column()
  mostEducation: SchoolLevel = SchoolLevel.NONE;
}
