export function checkWeightGoalFeasibility(currentWeight, targetWeight, height, birthday) {
    // Calculate age
  const today = new Date();
  const birthDate = new Date(birthday);
  const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(birthDate.setFullYear(today.getFullYear())) ? 1 : 0);

    
    // Calculate BMI for target weight
    const heightInMeters = height / 100;
    const targetBMI = targetWeight / (heightInMeters * heightInMeters);
  
    // Check if the target BMI is too low
    if (targetBMI < 18.5) {
      return `Warning: Your target weight of ${targetWeight} kg may be too low for your height (${height} cm) and age (${age}). Consider consulting a healthcare professional to set a healthy and achievable goal.`;
    }
  
    // No warning needed if target BMI is within a healthy range
    return `Your target weight of ${targetWeight} kg is within a healthy range for your height (${height} cm) and age (${age}).`;
  }
  
  // Example usage
  const warningMessage = checkWeightGoalFeasibility(95, 70, 180, 42);
  console.log(warningMessage);
  