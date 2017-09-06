// @flow

import { typeErrorAsNull } from './util.js';

type EmailAddress = string;
type PhoneNumber = string;

// Solution 1

/* We can take pretty mechanical approach here. We want to translate the conjuctions and disjunctions of our validation into the structure of type declaration. Starting from the outside, we see that our outermost branch is about whether we have a PO box or a home address. When we hear branch, we should think tagged union so our first step will give us something like:

   type PickupInfo =
     { tag: 'HomeAddress', address: string, ...unknown... } |
     { tag: 'POBox', address: string, ...unknown... }

Now we want to "zoom in" and look at each branch of the disjunction. On the left hand side (the 'HomeAddress' side), we notice that there's nothing more to check. We're done there `{tag: 'HomeAddress', address: string } | ...`.

Now we have to fill out the 'POBox' side of our union based on the logic we've described in validation function. If we look at it for a bit, we can convince ourselves that the validation function is demanding we have at least one of `homePhone` and `mobilePhone`. This notion of `AtLeastOne` isn't intimately tied to our business logic and sounds like it ought to be reusable so we create a generic type called `AtLeastOne`.

Now, we can slot the phone number(s) along side our 'POBox' address and this tagged union can slide in next to `name` (which we see that we always need, even in the original version, so it stays outside the tagged union. If we brought it inside the tagged union, we'd just end up duplicating it in each branch).

We're done! We see that we can write out our valid `ShippingInfo` without too much travel. However, if we try a direct translation of our invalid `ShippingInfo` from before, it won't type check! We've made illegal state unrepresentable! It's probably worth fiddling around with `badShippingInfo` for a few minutes to convince yourself that it's no longer representable.

Stepping back a second, we see some patterns here. Disjunctions in our validation function correspond to a union in our type and conjunctions in our validation function correspond to records (which we can also think of as the intersection of many labeled values. Thinking of records this way enhances the symmetry between disjunctions <-> unions and conjunctions <-> intersections). */

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

/* Our first step here is to reify the idea of a proper fraction (actually positive proper fraction). What leads us to take this step? We're performing the same logical operation (checking that a number is in a range of validity multiple times) multiple times and giving it a name, a type and shared code allows us to ensure that we're always performing the same check and track whether or not the check has been performed in the type system. The limitations of ES6 classes mean that we must expose a constructor which throws an error on invalid data. But our preferred API should be `make` which helpfully reports the possibility of failure (by signaling that it might return `null` instead of an actual `ProperFraction`) in the type signature and allows us to handle failure as a normal, non-exceptional value which is usually convenient.

Another easy step is to note that, while our original type signature allows both a `latePenaltyPerDay` and `latePenaltyPerWeek` to be present, our validation function forbids it. We can more faithfully encode this logic in our type declarations with a tagged union like `LatePenalty` (note again the disjunction <-> union correspondence). I'll point out that we also could have encoded this requirement more generically using an `Either<Left, Right>` type similar to our `AtLeastOne` above. It would definitely work, but I chose not to here because I think it would present slightly misleading semantics. `Either<ProperFraction, ProperFraction>` makes the left and right branches seem more symmetrical than they actually are. The units of measure on each branch are actually different! One is percentage points per week and the other is percentage points per day, but the `Either` encoding makes it easy to forget that distinction.

`curveMinimum`, `curveMaximum` and `passingGrade` suffer from an admittedly strange encoding here. In part, this exercise is just another opportunity to stretch ourselves and find less error-prone encodings. It's also a good opportunity to point out that this process can't and shouldn't be purely mechanical. It'll require human discretion to determine where to draw the line (how many lines of code are required to bring how much safety, how natural is the encoding, which of several technically equivalent encodings is best). I'd say that in actual code this encoding would be confusing enough to merit proscription.

It does give us an example of an occasionally handy trick though. If we have two (or more) cardinal values that must satisfy some relationship, we can sometimes make illegal state unrepresentable by "flipping things inside out". Instead of making our cardinal values explicit and their relationship implicit, we can make the relationship explicit and one of the cardinal values implicit. This may allow us to express restrictions on the relationship that are otherwise difficult or practically-speaking impossible to express. Another example, besides the `passingGrade` and `curve` values we see here is ensuring that a start timestamp precedes an end timestamp by using a start timestamp and positive duration.

To wrap up this section, we again see that we can write out valid grading policies without too much trouble while we can't write out invalid grading policies except by using discouraged APIs like `new ProperFraction` which will just error out anyway. */

class ProperFraction {
  raw: number;
  constructor(num: number): ProperFraction {
    if (0 <= num && num <= 1) { // eslint-disable-line yoda
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
  { tag: 'PenaltyPerWeek', penalty: ProperFraction };

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

/* This last problem is probably the trickiest so far. I'll assume that the idea and mechanics of `IPAddress` are familiar enough by now for a description to be omissable.

Our next step is to represent the browser as an explicit enumeration instead of just a string (with a fallback to 'Other' for uncommon browsers). The advantage here is simple exhaustivity checking. If we ever want to add or remove support for a major browser, having an enumeration like this can make our refactorings easy and tedious rather than fraught.

After that, we look at our validation function and get the intuition (built by our observations about disjunction and conjunction symmetry in earlier examples) that our `SignupInfo` might work better mirroring the validation structure than cramming all the fields together nullably.

In the first phase, we just have information sent by the browser and nothing else.

If we go back and think about our business logic, we should realize that in the `FormDataEntered` phase, we have raw but complete data from the user so that's reflected in simple, primitive types like `string`. This is indeed what this branch of the union specifies (we can think of intersection (&) on records as just concatenating the collection of fields).

Earlier, we used types with guarded constructors to make things like invalid `EmailAddress`s and invalid `IPAddress`s impossible to represent (except as untrusted strings). For the server side checks in `ServerCheckedSubmission`, we want to follow a similar pattern. It should be impossible to have a non-unique username which purports to be unique and a password which does not conform to our password policy but purports to. We can enforce this discipline by creating classes which witness these refinements and can only be constructed inside the response parsers for the server validation APIs. This makes our security surface area smaller and our lives easier by establishing a small trusted kernel.

The final stage is much like the previous one.

One question you may have is, "Why not just represent our validated fields more like they were in the original exercise formulation"? That is, with paired booleans? (`{ proposedPassword: string, passwordMeetsPolicy: boolean }`) There are a couple reasons. One is that booleans don't carry their context with them and can easily lose meaning (see "boolean blindness": https://existentialtype.wordpress.com/2011/03/15/boolean-blindness/). A naked boolean only carries human-intelligible meaning when paired with a name and it's easy for that name to drift from the intended meaning as we traverse layers of source code. The other big reason is that a boolean is much less trustworthy than a properly constructed witness like `UniqueUsername`. Anyone can forge a boolean anywhere that purports to ensure uniqueness. But it would be easy to lie, even on accident! By carefully locking down access to `UniqueUsername`, we can be sure that when we receive a value of this type, it's corresponding check has been performed.

What was the overall pattern in this exercise? We noted that we have a state machine and then encoded each state with all its attendant attributes as a branch in a tagged union. When we progress through the state machine, we progress through the branches of the tagged union in a way that ensures we have all and only the appropriate attributes corresponding to each state. Pretty cool! */

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

// Really, we'd want to have a private constructor for this which is only usable inside the server response parser so that we can't easily forge (in the sense of forgery) this check on the client side.
class UniqueUsername {
  raw: string;
}

// Really, we'd want to have a private constructor for this which is only usable inside the server response parser so that we can't easily forge (in the sense of forgery) this check on the client side.
class ConformantPassword {
  raw: string;
}

// Really, we'd want to have a private constructor for this which is only usable inside the server response parser so that we can't easily forge (in the sense of forgery) this check on the client side.
class VerifiedEmailAddress {
  raw: EmailAddress;
}

type UncheckedFormData = {
  proposedUsername: string,
  proposedPassword: string,
  emailAddress: EmailAddress,
};

type ServerVerifiedFormData = {
  username: UniqueUsername,
  password: ConformantPassword,
  emailAddress: EmailAddress,
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
