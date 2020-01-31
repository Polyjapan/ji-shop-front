import {SubscriptionLike} from 'rxjs/internal/types';
import {rxSubscriber as rxSubscriberSymbol} from 'rxjs/internal/symbol/rxSubscriber';
import {Subscriber} from 'rxjs/internal/Subscriber';
import {Subscription} from 'rxjs/internal/Subscription';
import {Subject} from 'rxjs';

export class BetterSubjectSubscriber<T> extends Subscriber<T> {
  constructor(protected destination: BetterSubject<T>) {
    super(destination);
  }
}

/**
 * A subject that posts the value to the observer when he first subscribes
 */
export class BetterSubject<T> extends Subject<T> implements SubscriptionLike {
  private value: T;

  [rxSubscriberSymbol]() {
    return new BetterSubjectSubscriber(this);
  }

  constructor() {
    super();
  }

  next(value: T) {
    super.next(value);
    this.value = value;
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): Subscription {
    const ret = super._subscribe(subscriber);

    if (this.value) {
      subscriber.next(this.value);
    }

    return ret;
  }
}
