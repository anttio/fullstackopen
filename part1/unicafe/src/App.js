import React, { useState } from 'react';

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);

const Statistic = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positive = (good * 100) / total;

  if (total) {
    return (
      <>
        <Statistic text="Good" value={good} />
        <Statistic text="Neutral" value={neutral} />
        <Statistic text="Bad" value={bad} />
        <Statistic text="All" value={total} />
        <Statistic text="Average" value={average} />
        <Statistic text="Positive" value={positive} />
      </>
    );
  }

  return <p>No feedback given.</p>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="Good" handleClick={() => setGood(good + 1)} />
      <Button text="Neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="Bad" handleClick={() => setBad(bad + 1)} />

      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
