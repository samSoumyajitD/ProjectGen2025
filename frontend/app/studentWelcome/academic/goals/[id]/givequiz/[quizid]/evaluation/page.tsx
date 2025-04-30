"use client";
import { useParams } from 'next/navigation';
import React from 'react';

const EvaluationPage = () => {
  const params = useParams();
  const { id, quizid } = params as { id: string; quizid: string };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Quiz Evaluation</h1>
      <p>Welcome to the quiz evaluation page!</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Quiz Details</h2>
        <p>Goal ID: {id}</p>
        <p>Quiz ID: {quizid}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Results</h2>
        <p>Score: 85%</p>
        <p>Status: Passed</p>
      </div>
    </div>
  );
};

export default EvaluationPage;