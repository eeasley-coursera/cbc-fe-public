// @flow

// With each exercise, the goal is to move the validations into our type declarations as much as possible. If you're confused about the task at hand (or get stuck), review the exercises and solutions in `17-9-1` or ask in #correctbyconstruction.

// Assume a library provides better implementations

type EmailAddress = string;
type PhoneNumber = string;

// Exercise 1

type ShippingInfo = {
  name: string,
  homePhone?: PhoneNumber,
  mobilePhone?: PhoneNumber,
  homeAddress?: PhoneNumber,
  poBox?: string
};

function validShippingInfo(contactInfo: ShippingInfo): boolean {
  const { homePhone, mobilePhone, homeAddress, poBox } = contactInfo;
  return (
    homeAddress != null && poBox == null ||
    poBox != null && homeAddress == null &&
      (homePhone != null || mobilePhone != null));
}

const goodShippingInfo: ShippingInfo = {
  name: 'Avril Mondragon',
  homePhone: '555-4444',
  poBox: 'Enfield Tennis Academy',
};

const badShippingInfo: ShippingInfo = {
  name: 'Avril Mondragon',
  poBox: 'Enfield Tennis Academy',
};

console.log(validShippingInfo(goodShippingInfo), validShippingInfo(badShippingInfo));

// Exercise 2

type GradingPolicy = {
  curveMinimum: number,
  curveMaximum: number,
  passingGrade: number,
  latePenaltyPerDay?: number,
  latePenaltyPerWeek?: number,
};

function validGrade(number: number): boolean {
  return 0 <= number && number <= 1; // eslint-disable-line yoda
};

function validGradingPolicy(gradingPolicy: GradingPolicy): boolean {
  const { curveMinimum, curveMaximum, passingGrade, latePenaltyPerDay, latePenaltyPerWeek } = gradingPolicy;
  return (
    validGrade(curveMinimum) && validGrade(curveMaximum) && validGrade(passingGrade) &&
      curveMinimum < curveMaximum && curveMinimum <= passingGrade && passingGrade <= curveMaximum &&
      (latePenaltyPerDay == null || latePenaltyPerWeek == null));
}

const goodGradingPolicy: GradingPolicy = {
  curveMinimum: 0.5,
  curveMaximum: 1,
  passingGrade: 0.7,
  latePenaltyPerWeek: 0.1,
};

const badGradingPolicy: GradingPolicy = {
  curveMinimum: 0.5,
  curveMaximum: 0.8,
  passingGrade: 0.9,
  latePenaltyPerDay: 0.01,
  latePenaltyPerWeek: 0.1,
};

console.log(validGradingPolicy(goodGradingPolicy), validGradingPolicy(badGradingPolicy));

// Exercise 3

type SignupInfo = {
  browser: string,
  ipAddress: string,
  proposedUsername?: string,
  usernameIsUnique?: boolean,
  proposedPassword?: string,
  passwordMeetsPolicy?: boolean,
  emailAddress?: EmailAddress,
  emailVerified?: boolean,
  phase: string,
};

function validIpAddress(ipAddress: string): boolean {
  const ipPattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  return ipPattern.test(ipAddress);
}

function validSignupInfo(signupInfo: SignupInfo): boolean {
  const { proposedUsername,
          usernameIsUnique,
          proposedPassword,
          passwordMeetsPolicy,
          emailAddress,
          emailVerified,
          phase } = signupInfo;
  const formDataPresent = proposedUsername != null && proposedPassword != null && emailAddress != null;
  const formDataAbsent = proposedUsername == null && proposedPassword == null && emailAddress == null;
  const serverChecksSucceded = usernameIsUnique === true && passwordMeetsPolicy === true;
  const serverChecksAbsent = usernameIsUnique == null && passwordMeetsPolicy == null;
  if (phase === 'justStarted') {
    return formDataAbsent && serverChecksAbsent && emailVerified == null;
  } else if (phase === 'formDataEntered') {
    return formDataPresent && serverChecksAbsent && emailVerified == null;
  } else if (phase === 'serverCheckedSubmission') {
    return formDataPresent && serverChecksSucceded && emailVerified == null;
  } else if (phase === 'fullyComplete') {
    return formDataPresent && serverChecksSucceded && emailVerified === true;
  } else {
    console.warn('Unknown phase');
    return false;
  }
}

const goodSignupInfo: SignupInfo = {
  browser: 'Firefox',
  ipAddress: '127.0.0.1',
  proposedUsername: 'Hal Incandenza',
  proposedPassword: 'tunnel',
  emailAddress: 'hal@enfield.edu',
  phase: 'formDataEntered',
};

const badSignupInfo: SignupInfo = {
  browser: 'Firefox',
  ipAddress: '127.0.0.1',
  proposedUsername: 'Hal Incandenza',
  proposedPassword: 'tunnel',
  emailAddress: 'hal@enfield.edu',
  phase: 'serverCheckedSubmission',
};

console.log(validSignupInfo(goodSignupInfo), validSignupInfo(badSignupInfo));
