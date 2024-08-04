import { Controller, Get, Param } from "@nestjs/common";
import { WeightService } from "./weight.service";

 
@Controller('weight')
export class WeightControler {

constructor(private readonly weightService: WeightService) {}

    @Get('get')
    async getUserData(@Param('id') id:string) {
        return this.weightService.getUserData(+id)
    }
}