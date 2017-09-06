// @flow

// Assume better implementations for these are provided in a library

type TimeStamp = string;
type EmailAddress = string;
type Duration = string;
type Html = string;

// Exercise 1

type ProperFraction = number;

type CourseStatus = { startedAt: TimeStamp, completedAt: ?TimeStamp, courseGrade: ?number };

// Exercise 2

type CaseInsensitiveString = string;

type TemplatedEmail = {
  headerKeys: Array<string>,
  headerValues: Array<string>,
  body: string,
  recipients: Array<EmailAddress>
};
