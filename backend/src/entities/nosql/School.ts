import {
  Entity,
  PrimaryColumn,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
} from "typeorm";
import utils from "util";
import {
  AcademicPrograms,
  SchoolResponse,
  SchoolResult,
} from "../../tasks/school";

export class SchoolLocation {
  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  lat: number;

  @Column()
  lon: number;

  constructor(
    $city: string,
    $state: string,
    $zip: string,
    $lat: number,
    $lon: number
  ) {
    this.city = $city;
    this.state = $state;
    this.zip = $zip;
    this.lat = $lat;
    this.lon = $lon;
  }
}

export class SchoolDemographics {
  @Column()
  female_share!: number;

  @Column()
  age_entry!: number;

  @Column()
  first_generation!: number;

  @Column()
  men!: number;

  @Column()
  dependent!: number;

  @Column()
  women!: number;

  @Column()
  black!: number;

  @Column()
  asian!: number;

  @Column()
  white!: number;

  @Column()
  aian!: number;

  @Column()
  hispanic!: number;
}

export class SchoolAcademics {
  @Column()
  bachelors!: boolean;
  @Column()
  associate!: boolean;
  @Column()
  percentage!: number;
  @Column()
  degree!: boolean;
}

export class SchoolAcademicRoot {
  @Column()
  education!: SchoolAcademics;
  @Column()
  mathematics!: SchoolAcademics;
  @Column()
  business_marketing!: SchoolAcademics;
  @Column()
  communications_technology!: SchoolAcademics;
  @Column()
  language!: SchoolAcademics;
  @Column()
  visual_performing!: SchoolAcademics;
  @Column()
  engineering_technology!: SchoolAcademics;
  @Column()
  parks_recreation_fitness!: SchoolAcademics;
  @Column()
  agriculture!: SchoolAcademics;
  @Column()
  security_law_enforcement!: SchoolAcademics;
  @Column()
  computer!: SchoolAcademics;
  @Column()
  precision_production!: SchoolAcademics;
  @Column()
  humanities!: SchoolAcademics;
  @Column()
  library!: SchoolAcademics;
  @Column()
  psychology!: SchoolAcademics;
  @Column()
  social_science!: SchoolAcademics;
  @Column()
  legal!: SchoolAcademics;
  @Column()
  english!: SchoolAcademics;
  @Column()
  construction!: SchoolAcademics;
  @Column()
  military!: SchoolAcademics;
  @Column()
  communication!: SchoolAcademics;
  @Column()
  public_administration_social_service!: SchoolAcademics;
  @Column()
  architecture!: SchoolAcademics;
  @Column()
  ethnic_cultural_gender!: SchoolAcademics;
  @Column()
  resources!: SchoolAcademics;
  @Column()
  health!: SchoolAcademics;
  @Column()
  engineering!: SchoolAcademics;
  @Column()
  history!: SchoolAcademics;
  @Column()
  theology_religious_vocation!: SchoolAcademics;
  @Column()
  transportation!: SchoolAcademics;
  @Column()
  physical_science!: SchoolAcademics;
  @Column()
  science_technology!: SchoolAcademics;
  @Column()
  biological!: SchoolAcademics;
  @Column()
  family_consumer_science!: SchoolAcademics;
  @Column()
  philosophy_religious!: SchoolAcademics;
  @Column()
  personal_culinary!: SchoolAcademics;
  @Column()
  multidiscipline!: SchoolAcademics;
  @Column()
  mechanic_repair_technology!: SchoolAcademics;
}

export class AcademicInfo {
  @Column()
  name!: string;
  @Column()
  stats!: SchoolAcademics;
}

export class SchoolAdmissions {
  @Column()
  admission_rate!: number;

  @Column()
  average_sat!: number;

  @Column()
  average_sat_reading!: number;

  @Column()
  average_sat_writing!: number;

  @Column()
  average_sat_math!: number;

  @Column()
  average_act!: number;

  @Column()
  average_act_math!: number;

  @Column()
  average_act_english!: number;

  @Column()
  average_act_writing!: number;
}

@Entity()
export class School {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  school_id!: number;

  @Column()
  name!: string;

  @Column()
  school_url!: string;

  @Column()
  price_calculator_url!: string;

  @Column((type) => SchoolLocation)
  location!: SchoolLocation;

  // @Column(() => SchoolAcademicRoot)
  // academics: SchoolAcademicRoot | null = null;

  @Column(() => AcademicInfo)
  academics: AcademicInfo[] = [];

  @Column(() => SchoolAdmissions)
  admissions: SchoolAdmissions | null = null;

  @Column(() => SchoolDemographics)
  demographics!: SchoolDemographics;

  static fromResponse(res: SchoolResult) {
    const school = new School();
    school.name = res.school.name;
    school.school_id = res.id;
    school.school_url = res.school.school_url;
    school.price_calculator_url = res.school.price_calculator_url;
    school.location = new SchoolLocation(
      res.school.city,
      res.school.state,
      res.school.zip,
      res.location.lat,
      res.location.lon
    );

    const iterator =
      res.latest.academics.program.bachelors ||
      res.latest.academics.program.assoc ||
      res.latest.academics.program.degree;

    if (iterator) {
      const academics: AcademicInfo[] = [];

      //@ts-expect-error
      Object.keys(iterator).forEach((program: keyof AcademicPrograms) => {
        const associate = Boolean(
          res.latest.academics.program.assoc?.[program]
        );
        const bachelors = Boolean(
          res.latest.academics.program.bachelors?.[program]
        );
        const degree = Boolean(res.latest.academics.program.degree?.[program]);

        const stat = new AcademicInfo();
        stat.name = program;
        stat.stats = {
          associate: associate,
          bachelors: bachelors,
          degree: degree,
          percentage: res.latest.academics.program_percentage?.[program] ?? 0,
        };
        academics.push(stat);
      });

      school.academics = academics;
    }

    if (res.latest.student.admissions) {
      const admissions = new SchoolAdmissions();
      admissions.admission_rate =
        res.latest.student.admissions.admission_rate.overall;
      admissions.average_act =
        res.latest.student.admissions.act_scores.midpoint.cumulative;
      admissions.average_act_english =
        res.latest.student.admissions.act_scores.midpoint.english;
      admissions.average_act_math =
        res.latest.student.admissions.act_scores.midpoint.math;
      admissions.average_act_writing =
        res.latest.student.admissions.act_scores.midpoint.writing;
      admissions.average_sat =
        res.latest.student.admissions.sat_scores.average.overall;
      admissions.average_sat_math =
        res.latest.student.admissions.sat_scores.midpoint.math;
      admissions.average_sat_reading =
        res.latest.student.admissions.sat_scores.midpoint.critical_reading;
      admissions.average_sat_writing =
        res.latest.student.admissions.sat_scores.midpoint.writing;
      school.admissions = admissions;
    }

    const demo = new SchoolDemographics();

    const d = res.latest.student.demographics;
    demo.age_entry = d.age_entry;
    demo.aian = d.race_ethnicity.aian;
    demo.asian = d.race_ethnicity.asian;
    demo.black = d.race_ethnicity.black;
    demo.white = d.race_ethnicity.white;
    demo.hispanic = d.race_ethnicity.hispanic;
    demo.men = d.men;
    demo.women = d.women;
    demo.first_generation = d.first_generation;
    demo.female_share = d.female_share;

    school.demographics = demo;

    return school;
  }
}
