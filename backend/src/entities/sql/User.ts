import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import argon2 from "argon2";
import jsonwebtoken from "jsonwebtoken";
import { CONN_SQL } from "../../db";
import UserInterests from "./UserInterests";

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

export enum Ethnicity {
  // American Indian/Alaskan Native
  AI_AN = "ai_an",
  ASIAN = "asian",
  BLACK = "black",
  HISPANIC = "hispanic",
  ISLANDER = "islander",
  CAUCASIAN = "caucasian",
}

export enum Gender {
  NA = "n/a",
  MALE = "m",
  FEMALE = "f",
  NON_BINARY = "nb",
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

  @Column()
  gender: Gender = Gender.NA;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true, type: "character varying" })
  ethnicity: Ethnicity | null = null;

  @Column({ type: "decimal", nullable: true })
  gpa: number | null = null;

  @Column({ nullable: true, type: "integer" })
  satScore: number | null = null;

  password!: string;

  @Column()
  encryptedPassword!: string;

  @Column()
  mostEducation: SchoolLevel = SchoolLevel.NONE;

  @OneToMany(() => UserInterests, (interests) => interests.user, { lazy: true })
  interests!: UserInterests[];

  @BeforeInsert()
  @BeforeUpdate()
  async presave() {
    if (this.password) {
      this.encryptedPassword = await argon2.hash(this.password);
    }
  }

  getToken(): string {
    return jsonwebtoken.sign(
      {
        id: this.id,
      },
      process.env.JWT_KEY!
    );
  }

  async clean() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      ethnicity: this.ethnicity,
      email: this.email,
      gpa: this.gpa,
      gender: this.gender,
      mostEducation: this.mostEducation,
      interests: (await this.interests).map((i) => i.interest),
    };
  }
}
