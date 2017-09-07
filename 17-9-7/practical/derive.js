// @flow

// Obviously, we could do better than this but these aren't the focus at the moment.
type Grade = number;
type Timestamp = string;

const _: any = undefined;

type QuizAttempt = { timestamp: Timestamp, score: Grade, quizId: string };

function derive(quizAttempts: Array<QuizAttempt>): ?Grade {
  return _;
}
