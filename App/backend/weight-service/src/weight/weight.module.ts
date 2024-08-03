import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { WeightService } from "./weight.service";
import { WeightControler } from "./weight.controler";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'api-users',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 3000
                }
            }
        ])
    ],
    controllers: [WeightControler],
    providers: [WeightService]
})

export class WeightModule {}