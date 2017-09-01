// @flow

type TimeStamp = string;
type EmailAddress = string;

type CourseStatus = { startedAt: TimeStamp, completedAt: ?TimeStamp, courseGrade: ?number };

type TemplatedEmail = {
  headerKeys: Array<string>,
  headerValues: Array<string>,
  body: string,
  recipients: Array<EmailAddress>
};
