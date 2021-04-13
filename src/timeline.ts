import Heap from 'heap-js'

export class TimelineEvent {
  milliseconds: number;
  fn: Function;
}

const priorityComparator = (a: TimelineEvent, b: TimelineEvent) => a.milliseconds - b.milliseconds;

export class Timeline {
  timeline: Heap<TimelineEvent>;

  constructor() {
    this.timeline = new Heap(priorityComparator); 
  }
}