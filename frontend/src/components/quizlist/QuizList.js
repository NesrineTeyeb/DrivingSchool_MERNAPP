// Ce composant affiche tous les quiz disponibles et permet de cliquer sur l’un d’eux pour le voir en détail.
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quizzes") //Appel pour le backend
      .then((response) => setQuizzes(response.data))
      .catch((error) => console.error("Error while loading quizzes", error));
  }, []);
  return (
    <div>
      <h2> Liste des Quizz</h2>
      <ul className="list-group">
        {quizzes.map((quiz) => (
          <li key={quiz._id} className="list-group-item">
            <Link to={`/quiz/${quiz._id}`} className="text-decoration-none">
              {quiz.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;
