import { config } from "dotenv";
import axios from "axios";
config();

type SchoolResponse = {
  metadata: {
    total: number;
    page: number;
    per_page: number;
  };
  results: {
    school: {};
    id: number;
    latest: {
      student: {
        students_with_pell_grants: number;
        grad_students: number;
        share_firstgeneration: number;
        undergrats_with_pell_grant_or_federal_student_loan: number;
        share_25_older: number;
        share_independent_students: 0.156407669;
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
          dependend: number;
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
      };
    };
    ope6_id: number;
    location: {
      lon: number;
      lat: number;
    };
  }[];
};

const SCHOOL_URL = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${process.env.COLLEGE_SCORECARD}`;

export async function main() {
  const res = (await axios.get<SchoolResponse>(SCHOOL_URL)).data;
  console.log(res);
  return res;
}

main();
