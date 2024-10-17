import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StaticticsYearModel } from 'src/Model/S/StaticticsYearModel';
import { ForYearEvent } from 'src/Validation/Listener/StaticticsEvent';

@Injectable()
export class StaticticsForYearEventListener {

  constructor(
    private statictics: StaticticsYearModel  
  ) {}

  register(event: ForYearEvent) {
    this.statictics.Execute({ name:event.event,id:event.id });
  }
}