import Heap from 'heap-js'
import p5 from 'p5';

interface TimelineEvent {
  milliseconds: number;
  fn: () => void;
}

const priorityComparator = (a: TimelineEvent, b: TimelineEvent) => a.milliseconds - b.milliseconds;

export class Timeline {
  timeline: Heap<TimelineEvent>;
  p5: p5;

  constructor(p5: p5) {
    this.timeline = new Heap(priorityComparator); 
    this.p5 = p5;
  }

  schedule(milliseconds: number, fn: () => void): void {
    const event = {
      milliseconds: milliseconds + this.p5.millis(),
      fn,
    }
    this.timeline.push(event)
  }

  isEmpty(): boolean {
    return this.timeline.length === 0;
  }

  getAllExpiredEvents(): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    do {
      const event = this.getExpiredEvent();
      if (event) {
        events.push(event);
      }
    } while (event);
    return events;
  }

  getExpiredEvent(): TimelineEvent | undefined {
    const now = this.p5.millis();
    const event = this.timeline.peek();
    if (event?.milliseconds < now) {
      return this.timeline.pop();
    } else {
      return undefined;
    }
  }
}