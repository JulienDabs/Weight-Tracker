import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { HttpModule} from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}
