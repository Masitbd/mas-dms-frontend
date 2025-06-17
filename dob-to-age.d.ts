declare module "dob-to-age" {
  /**
   * Converts a date of birth to the corresponding age.
   * @param dob - The date of birth, in string or Date format.
   * @returns The calculated age in years as a number.
   */
  function dobToAge(dob: string | Date): { count: number; unit: string };

  export = dobToAge;
}
