// @flow

import { typeErrorAsNull } from './util.js';

type EmailAddress = string;
type PhoneNumber = string;

// Solution 1

// This is a very general type that you'd only ever have to write once and could reuse throughout your application
type AtLeastOne<A, B> =
  { tag: 'Left', value: A } |
  { tag: 'Right', value: B } |
  { tag: 'Both', left: A, right: B }

type PickupInfo =
  { tag: 'HomeAddress', address: string } |
  { tag: 'POBox', address: string, phoneNumber: AtLeastOne<PhoneNumber, PhoneNumber> }

type ShippingInfo = {
  name: string,
  pickupInfo: PickupInfo
};

const goodShippingInfo: ShippingInfo = {
  name: 'Avril Mondragon',
  pickupInfo: {
    tag: 'POBox',
    address: 'Enfield Tennis Academy',
    phoneNumber: {
      tag: 'Left',
      value: '555-4444',
    },
  },
};

// Doesn't type check, as desired.
// const badShippingInfo: ShippingInfo = {
//   name: 'Avril Mondragon',
//   pickupInfo: {
//     tag: 'POBox',
//     address: 'Enfield Tennis Academy',
//   },
// };

// Solution 2

class ProperFraction {
  raw: number;
  constructor(num: number): ProperFraction {
    if (0 <= num && num <= 1) {// eslint-disable-line yoda
      this.raw = num;
      return this;
    } else {
      throw new TypeError('Number out of range');
    }
  }
  static make(num: number): ?ProperFraction {
    return typeErrorAsNull(() => new ProperFraction(num));
  }
}

type LatePenalty =
  { tag: 'PenaltyPerDay', penalty: ProperFraction } |
  { tag: 'PenaltyPerWeek', penalty: ProperFraction }

// `curveMinimum`, `curveMaximum` and `passingGrade` suffer from an admittedly strange encoding here. In part, this exercise is just another opportunity to stretch ourselves and find less error-prone encodings. It's also a good opportunity to point out that this process can't and shouldn't be purely mechanical. It'll require human discretion to determine where to draw the line (how many lines of code are required to bring how much safety, how natural is the encoding, which of several technically equivalent encodings is best). I'd say that in actual code this encoding would be confusing enough to merit proscription.
type GradingPolicy = {
  curveMinimum: ProperFraction,
  curveMaximum: ProperFraction, // This time, the maximum is represented as the fraction of the span between the minimum and 1---the fractional distance along the "number line".
  passingGrade: ProperFraction, // The passing grade is the fraction of the span between minimum and maximum---the fractional distance along the "number line".
  latePenalty?: LatePenalty
};

const goodGradingPolicy: GradingPolicy = {
  curveMinimum: new ProperFraction(0.5), // The default constructor throws exceptions so we should generally avoid it. But here, we know statically that it's okay.
  curveMaximum: new ProperFraction(1), // The maximum is at the far end of the range interval 0.5 to 1.
  passingGrade: new ProperFraction(0.4), // 0.7 (the raw passing grade) is four tenths of the way between 0.5 and 1.
  latePenalty: {
    tag: 'PenaltyPerWeek',
    penalty: new ProperFraction(0.1),
  },
};

// The old `badGradingPolicy` can't be encoded properly in the new type. Just as we hoped!

// Solution 3

class IPAddress {
  raw: string;
  constructor(str: string): IPAddress {
    if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(str)) {
      this.raw = str;
      return this;
    } else {
      throw new TypeError('Not formatted as IP address');
    }
  }
  static make(num: number): ?ProperFraction {
    return typeErrorAsNull(() => new ProperFraction(num));
  }
}

type Browser = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | { tag: 'Other', browser: string };

type Baseline = {
  browser: Browser,
  ipAddress: IPAddress,
};

type UncheckedUsername = { tag: 'Unchecked', username: string };
// Really, we'd want to have a private constructor for this which is only usable inside the server response parser so that we can't easily forge (in the sense of forgery) this check on the client side.
type UniqueUsername = { tag: 'Unique', username: string };

type UncheckedPassword = { tag: 'Unchecked', password: string };
// Really, we'd want to have a private constructor for this which is only usable inside the server response parser so that we can't easily forge (in the sense of forgery) this check on the client side.
type ConformantPassword = { tag: 'Conformant', password: string };

type UncheckedEmailAddress = { tag: 'Unchecked', emailAddress: EmailAddress };
// Really, we'd want to have a private constructor for this which is only usable inside the server response parser so that we can't easily forge (in the sense of forgery) this check on the client side.
type VerifiedEmailAddress = { tag: 'Verified', emailAddress: EmailAddress };

type UncheckedFormData = {
  proposedUsername: string,
  proposedPassword: string,
  emailAddress: EmailAddress,
};

type ServerVerifiedFormData = {
  username: UniqueUsername,
  password: ConformantPassword,
  emailAddress: UncheckedEmailAddress,
};

type FullyVerifiedFormData = {
  username: UniqueUsername,
  password: ConformantPassword,
  emailAddress: VerifiedEmailAddress,
};

type SignupInfo =
  { phase: 'JustStarted' } & Baseline |
  { phase: 'FormDataEntered' } & Baseline & UncheckedFormData |
  { phase: 'ServerCheckedSubmission' } & Baseline & ServerVerifiedFormData |
  { phase: 'FullyComplete' } & Baseline & FullyVerifiedFormData;

const goodSignupInfo: SignupInfo = {
  browser: 'Firefox',
  ipAddress: new IPAddress('127.0.0.1'),
  proposedUsername: 'Hal Incandenza',
  proposedPassword: 'tunnel',
  emailAddress: 'hal@enfield.edu',
  phase: 'FormDataEntered',
};

// Doesn't type check, as desired.
// const badSignupInfo: SignupInfo = {
//   browser: 'Firefox',
//   ipAddress: new IPAddress('127.0.0.1'),
//   proposedUsername: 'Hal Incandenza',
//   proposedPassword: 'tunnel',
//   emailAddress: 'hal@enfield.edu',
//   phase: 'ServerCheckedSubmission',
// };
