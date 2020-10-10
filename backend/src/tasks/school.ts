import { config } from "dotenv";
import axios from "axios";
import { School } from "../entities/nosql/School";
import { inspect } from "util";
config();

type NumBool = 0 | 1;

export interface AcademicPrograms<T extends number = number> {
  education: T;
  mathematics: T;
  business_marketing: T;
  communications_technology: T;
  language: T;
  visual_performing: T;
  engineering_technology: T;
  parks_recreation_fitness: T;
  agriculture: T;
  security_law_enforcement: T;
  computer: T;
  precision_production: T;
  humanities: T;
  library: T;
  psychology: T;
  social_science: T;
  legal: T;
  english: T;
  construction: T;
  military: T;
  communication: T;
  public_administration_social_service: T;
  architecture: T;
  ethnic_cultural_gender: T;
  resources: T;
  health: T;
  engineering: T;
  history: T;
  theology_religious_vocation: T;
  transportation: T;
  physical_science: T;
  science_technology: T;
  biological: T;
  family_consumer_science: T;
  philosophy_religious: T;
  personal_culinary: T;
  multidiscipline: T;
  mechanic_repair_technology: T;
}

export type SchoolResult = {
  school: {
    name: string;
    school_url: string;
    zip: string;
    state: string;
    city: string;
    price_calculator_url: string;
    minority_serving: {
      predominantly_black: NumBool;
      aanipi: NumBool;
      hispanic: NumBool;
      annh: NumBool;
      nant: NumBool;
      tribal: NumBool;
      historically_black: NumBool;
    };
  };
  id: number;
  latest: {
    academics: {
      program_percentage: AcademicPrograms<number>;
      program: {
        bachelors?: AcademicPrograms<NumBool>;
        assoc?: AcademicPrograms<NumBool>;
        degree?: AcademicPrograms<NumBool>;
      };
      program_available: {
        bachelors: boolean;
        assoc: boolean;
        assoc_or_bachelors: boolean;
      };
    };
    student: {
      students_with_pell_grants: number;
      grad_students: number;
      share_firstgeneration: number;
      undergrats_with_pell_grant_or_federal_student_loan: number;
      share_25_older: number;
      share_independent_students: number;
      share_independent_highincome: {
        "110001plus": null;
        "75001_110000": null;
      };
      undergrads_with_pell_grant_or_federal_student_loan: 2040;
      share_middleincome: {
        "30001_48000": number;
        "48001_75000": number;
      };
      share_independent_lowincome: { "0_30000": number };
      share_independent_middleincome: {
        "30001_48000": number;
        "48001_75000": number;
      };
      share_first: {
        time_full: { time: number };
      };
      share_dependent_lowincome: {
        0_300000: number;
      };
      share_highincome: {
        "110001plus": number;
        "75001_110000": number;
      };
      repayment: {
        "5_yr_repayment": {
          income: {};
          completers: number;
          completers_rate: number;
          male_students: number;
          noncompleters: number;
          female_students: number;
          overall: number;
          dependend_students: number;
          first_generation_students_rate: number;
        };
        repayment_cohort: {};
      };
      demographics: {
        female_share: number;
        age_entry: number;
        share_born_US: { home_ZIP: number };
        share_black: { home_ZIP: number };
        median_hh_income: number;
        first_generation: number;
        men: number;
        dependent: number;
        married: number;
        women: number;
        race_ethnicity: {
          nhpi: number;
          non_resident_alien: number;
          black: number;
          asian: number;
          unknown: number;
          white: number;
          hispanic: number;
          aian: number;
        };
      };

      admissions: {
        admission_rate: { overall: number };
        sat_scores: {
          average: { overall: number };
          "25th_percentile": {
            critical_reading: number;
            writing: number;
            math: number;
          };
          "75th_percentile": {
            critical_reading: number;
            writing: number;
            math: number;
          };
          midpoint: {
            critical_reading: number;
            writing: number;
            math: number;
          };
        };
        act_scores: {
          "25th_percentile": {
            writing: number;
            english: number;
            math: number;
            cumulative: number;
          };
          midpoint: {
            writing: number;
            english: number;
            math: number;
            cumulative: number;
          };
          "75th_percentile": {
            writing: number;
            english: number;
            math: number;
            cumulative: number;
          };
        };
      };
    };
  };
  ope6_id: number;
  location: {
    lon: number;
    lat: number;
  };
};

export type SchoolResponse = {
  metadata: {
    total: number;
    page: number;
    per_page: number;
  };
  results: SchoolResult[];
};

const SCHOOL_URL = `https://api.data.gov/ed/collegescorecard/v1/schools`;

export async function fetchSchools(page: number = 0) {
  const res = (
    await axios.get<SchoolResponse>(SCHOOL_URL, {
      params: {
        per_page: 100,
        page: page,
        api_key: process.env.COLLEGE_SCORECARD,
      },
    })
  ).data;
  console.log(res.metadata);
  // return res;

  // console.log(
  //   inspect(
  //     res.results.map((r) => {
  //       return {
  //         n: r.school.name,
  //         a: r.latest.academics.program.assoc,
  //         b: r.latest.academics.program.bachelors,
  //       };
  //     }),
  //     false,
  //     null,
  //     true
  //   )
  // );
  const schools = res.results.map((r) => School.fromResponse(r));
  // console.log(inspect(schools[0], false, null, true));

  return {
    page: res.metadata.page,
    schools,
    meta: res.metadata,
  };
}

// fetchSchools();

type _School = {
  school_id: number;
  name: string;
  school_url: string;
  price_calculator_url: string;
  location: {
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  academics: {
    has_bachelors: boolean;
    has_associate: boolean;
    programs: {
      [key in keyof AcademicPrograms]: {
        associate: boolean;
        bachelors: boolean;
        percentage: number;
      };
    };
  };
  admissions: {};
  demographics: {};
};
