type PredictWeeksToGoalArgs = {
  currentWeight: number;
  targetWeight: number;
  gender: "male" | "female";
  birthday: string;
  activityLevel: number;
  height: number;
  bloodPressure?: number | null;
  chestSize?: number | null;
  heartRate?: number | null;
  hip?: number | null;
  thigh?: number | null;
  waist?: number | null;
};

export function predictWeeksToGoal({
  currentWeight,
  targetWeight,
  gender,
  birthday,
  activityLevel,
  height,
  bloodPressure = null,
  chestSize = null,
  heartRate = null,
  hip = null,
  thigh = null,
  waist = null,
}: PredictWeeksToGoalArgs): number | string {
  // Constants
  const caloriesPerKg = 7700; // Caloric deficit needed to lose 1 kg
  const activityMultipliers = {
    1: 1.3, // Sedentary
    2: 1.6, // Moderately active
    3: 1.8, // Very active
  };

  // Calculate age
  const today = new Date();
  const birthDate = new Date(birthday);
  const age =
    today.getFullYear() -
    birthDate.getFullYear() -
    (today < new Date(birthDate.setFullYear(today.getFullYear())) ? 1 : 0);

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  let bmr;
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }

  // Calculate daily caloric needs (Total Energy Expenditure)
  const dailyCaloricNeeds = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Adjust caloric intake to ensure a caloric deficit
  const caloricIntake = bmr; // Assume caloric intake equals BMR

  // Calculate daily caloric deficit
  let dailyCaloricDeficit = dailyCaloricNeeds - caloricIntake;

  // Ensure daily caloric deficit is at least minimal
  if (dailyCaloricDeficit <= 0) {
    dailyCaloricDeficit = 100; // Minimal caloric deficit to allow weight loss
  }

  const weeklyCaloricDeficit = dailyCaloricDeficit * 7;
  const weeklyWeightLoss = weeklyCaloricDeficit / caloriesPerKg;

  // Estimate weeks to reach goal weight
  const weightToLose = currentWeight - targetWeight;
  if (weightToLose <= 0) {
    return 'Target weight is already reached or surpassed.';
  }

  let weeks = weightToLose / weeklyWeightLoss;

  // Adjust for optional parameters
  if (heartRate) {
    // Increase precision based on heart rate (higher heart rate may mean higher calorie burn)
    weeks *= heartRate > 80 ? 0.9 : 1.05; // More optimistic adjustment
  }

  if (bloodPressure) {
    // Modify prediction based on blood pressure, for safety and metabolism impact
    weeks *= bloodPressure > 130 ? 1.05 : 0.85; // More optimistic adjustment
  }

  // Incorporate body composition factors
  if (chestSize || hip || thigh || waist) {
    const bodyFatFactor =
      1 -
      (0.008 * ((chestSize || 0) + (hip || 0) + (thigh || 0) + (waist || 0))) /
        4; // Reduced the impact for more optimism
    weeks *= bodyFatFactor;
  }

  return Math.max(1, Math.round(weeks)); // Ensure at least 1 week and round the number
}
