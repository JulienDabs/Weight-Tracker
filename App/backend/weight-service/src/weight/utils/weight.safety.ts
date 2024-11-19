

export function checkWeightGoalFeasibility(targetWeight: number, height: number) {
        
    // Calculate BMI for target weight
    const heightInMeters = height / 100;
    const targetBMI = targetWeight / (heightInMeters * heightInMeters);
  
   if (targetBMI < 18.5) {
    return true
   }
  }
  
 
  