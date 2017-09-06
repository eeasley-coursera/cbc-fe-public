// @flow

// Assume better implementations for these are provided in a library

type TimeStamp = string;
type ProperFraction = number;
type Duration = string;
type Html = string;

// Solution 1

type EmailAddress = string;


type CourseStatus =
  { tag: 'Unstarted' } |
  { tag: 'Incomplete', startedAt: TimeStamp } |
  { tag: 'Complete', startedAt: TimeStamp, duration: Duration, courseGrade: ProperFraction }

// Solution 2

type CaseInsensitiveString = string;

type TemplatedEmail = {
  headers: Array<[CaseInsensitiveString, string]>,
  body: Html,
  recipients: Set<EmailAddress>
};
