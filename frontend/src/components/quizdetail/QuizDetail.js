import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizDetails = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/quizzes/${id}`)
      .then((response) => setQuiz(response.data))
      .catch((error) => console.error("Erreur lors du chargement du quiz", error));
  }, [id]);

  const handleSelectAnswer = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  if (!quiz) return <p className="text-center">Chargement...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📝 {quiz.title}</h2>
      {quiz.questions.map((question, index) => (
        <div key={index} className="card p-3 mb-3 shadow-sm">
          <p><strong>Q{index + 1}: {question.questionText}</strong></p>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`btn ${userAnswers[index] === option ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => handleSelectAnswer(index, option)}
                disabled={score !== null} // Empêcher la sélection après soumission
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Bouton de soumission */}
      {score === null ? (
        <button className="btn btn-success mt-3 w-100" onClick={handleSubmit}>
          Soumettre mes réponses
        </button>
      ) : (
        <div className="text-center mt-3">
          <h4 className="text-success">✅ Votre score : {score} / {quiz.questions.length}</h4>
          <button className="btn btn-info mt-2 w-100" onClick={() => setShowAnswers(!showAnswers)}>
            {showAnswers ? "Masquer les réponses" : "Voir les réponses correctes"}
          </button>
        </div>
      )}

      {/* Affichage des réponses correctes après soumission */}
      {showAnswers && (
        <div className="mt-3">
          <h5>Réponses Correctes :</h5>
          {quiz.questions.map((question, index) => (
            <div key={index} className="alert alert-light">
              <p><strong>{question.questionText}</strong></p>
              <p className="text-success">✅ {question.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
