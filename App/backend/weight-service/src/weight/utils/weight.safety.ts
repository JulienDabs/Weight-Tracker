export function checkWeightGoalFeasibility(currentWeight, targetWeight, height, birthday) {
    // Calculate age
  const today = new Date();
  const birthDate = new Date(birthday);
  const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(birthDate.setFullYear(today.getFullYear())) ? 1 : 0);

    
    // Calculate BMI for target weight
    const heightInMeters = height / 100;
    const targetBMI = targetWeight / (heightInMeters * heightInMeters);
  
   if (targetBMI > 18.5) {
    return true
   }
  }
  
  // Example usage
  const warningMessage = checkWeightGoalFeasibility(95, 70, 180, 42);
  console.log(warningMessage);
  