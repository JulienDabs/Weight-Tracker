import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { LogWeightDto } from "./dto/log-weight";
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";


@Injectable()

export class WeightService {
    @Client({
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 3000
        }
    })
    private userServiceClient: ClientProxy
    constructor (private prisma: PrismaService) {}


    async getUserData(userId: number) {
        try {
            return await firstValueFrom(this.userServiceClient.send({cmd: 'getUserData'}, userId))
        } catch (error) {
            throw new NotFoundException (`User not found`)
        }
    }

    // async logWeight(data: LogWeightDto) {
    //     return this.prisma.weightLog.create ({
            
            
    //     })
    // }

    async getWeightHistory (userId: number) {
        return this.prisma.weightLog.findMany ({
            where: {userId},
            orderBy: {date: 'desc'}
        })
    }

    async predictGoalDate(userId: number, goalWeight: number) {
        const userData = await this.getUserData(userId);
        if (!userData) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
    
        if (!userData.isActive) {
          throw new BadRequestException('Cannot predict goal date for inactive user');
        }
    
        const weightLogs = await this.getWeightHistory(userId);
        if (weightLogs.length === 0) {
          throw new BadRequestException('No weight logs found for user');
        }
    
        const firstLog = weightLogs[0];
        const latestLog = weightLogs[weightLogs.length - 1];
    
        // Calculate weight change and time passed
        const weightChange = latestLog.weight - firstLog.weight;
        const daysPassed = (latestLog.date.getTime() - firstLog.date.getTime()) / (1000 * 3600 * 24);
    
        // Calculate daily weight change rate
        let dailyWeightChangeRate = weightChange / daysPassed;
    
        // Adjust rate based on activity level (assuming activityLevel is a value between 1-3)
        const activityMultiplier = 1 + ((userData.active - 2) * 0.1);  // -10% for low activity, +10% for high
        dailyWeightChangeRate *= activityMultiplier;
    
        // Consider blood pressure if available
        if (userData.bloodPressure) {
          const [systolic, diastolic] = userData.bloodPressure.split('/').map(Number);
          if (systolic > 140 || diastolic > 90) {
            dailyWeightChangeRate *= 0.9; // Slow down predicted weight change for high blood pressure
          }
        }
    
        // Calculate days to goal
        const weightToLose = latestLog.weight - goalWeight;
        const daysToGoal = weightToLose / Math.abs(dailyWeightChangeRate);
    
        if (!isFinite(daysToGoal) || daysToGoal < 0) {
          return {
            predictedDate: null,
            message: "Based on current trends, the goal weight may not be achievable. Consider adjusting your goal or increasing your activity level.",
            confidenceLevel: "Low"
          };
        }
    
        const goalDate = new Date(latestLog.date);
        goalDate.setDate(goalDate.getDate() + Math.ceil(daysToGoal));
    
        return {
          predictedDate: goalDate,
          daysToGoal: Math.ceil(daysToGoal),
          confidenceLevel: this.calculateConfidenceLevel(weightLogs.length, userData),
          message: this.generateAdvice(daysToGoal, weightToLose, userData)
        };
      }
    
      private calculateConfidenceLevel(dataPoints: number, userData: any): string {
        if (dataPoints < 5) return 'Low';
        if (dataPoints < 20) return 'Medium';
        return 'High';
      }
    
      private generateAdvice(daysToGoal: number, weightToLose: number, userData: any): string {
        const weeksTool = Math.ceil(daysToGoal / 7);
        const weeklyRate = (weightToLose / weeksTool).toFixed(2);
        const weeklyRateInt = parseInt(weeklyRate, 10);
    
        let advice = `Based on your current progress, you're on track to reach your goal in about ${weeksTool} weeks, `;
        advice += `losing an average of ${weeklyRate} kg per week. `;
    
        if (weeklyRateInt > 1) {
          advice += "This rate might be a bit aggressive. Consider slowing down for more sustainable results. ";
        } else if (weeklyRateInt < 0.5) {
          advice += "This is a very gradual approach. If you'd like to speed up your progress, consider increasing your activity level or adjusting your diet. ";
        } else {
          advice += "This is a healthy and sustainable rate of weight loss. Keep up the good work! ";
        }
    
        if (userData.active < 2) {
          advice += "Increasing your activity level could help you reach your goal faster. ";
        }
    
        return advice;
      }
}

