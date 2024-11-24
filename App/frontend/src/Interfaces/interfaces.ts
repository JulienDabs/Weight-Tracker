//gets user basic information from registration
export interface UserInfo {
    id: number;
    firstname: string;
    lastname: string;
    currentWeight: number;
    height: number;
    weightGoal: number;
    bloodPressure: string;
    currentActive: number;
    gender: string;
    birthday: string;
    currentBmi: number;
    currentWeeksToReachGoal: number;
    projectedBmi: number;
}

//gets logged weight information post by user
export interface WeightInfo {
    id: number;
    weight: number;
    userId: string;
    bloodPressure: string;
    chest: number;
    heartRate: number;
    hip: number;
    thigh: number;
    waist: number;
    active: number;
    bmi: number;
    weeksToReachGoal: number;
    date: string;
}

export interface NumberProps {
    n: number;
    delay?: number;
    unit?: string;
}
