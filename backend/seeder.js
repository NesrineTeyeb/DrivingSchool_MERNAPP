const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Quiz = require("./models/Quiz");
const Course= require("./models/Course")

dotenv.config();

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const courses = [

    {
      title: "Introduction to Traffic Rules",
      description: "Discover the basics of traffic rules.",
      videoURL: "https://www.youtube.com/watch?v=_NeEF1fwT4k&pp=ygUdSW50cm9kdWN0aW9uIHRvIFRyYWZmaWMgUnVsZXM%3Dhttps://www.youtube.com/watch?v=_NeEF1fwT4k&pp=ygUdSW50cm9kdWN0aW9uIHRvIFRyYWZmaWMgUnVsZXM%3D",
    },
    {
      title: "Traffic Signs",
      description: "Understand the meaning of road signs.",
      videoURL: "https://www.youtube.com/watch?v=KBTd5Vh-smw",
    },
    {
      title: "Driving in Difficult Conditions",
      description: "Learn how to drive safely in rain, snow, and other challenging conditions.",
      videoURL: "https://www.youtube.com/watch?v=-VXH7F5vVC0&t=3s",
    },
    {
      title: "Preparing for the Driving Test",
      description: "Tips and tricks to get ready for the practical driving test.",
      videoURL: "https://www.youtube.com/embed/YE7VzlLtp-4",
    },
    {
      title: "First Aid in Case of an Accident",
      description: "How to react and provide first aid in the event of a road accident.",
      videoURL: "https://www.youtube.com/shorts/NdXHzy5Diwo",
    },
  ];
const quizzes = [
  {
    title: "Code de la route - Niveau débutant",
    questions: [
      {
        questionText: "Quelle est la vitesse maximale autorisée en ville ?",
        options: ["30 km/h", "50 km/h", "70 km/h"],
        correctAnswer: "50 km/h",
      },
      {
        questionText: "Quel panneau indique une priorité à droite ?",
        options: [
          "Panneau stop",
          "Panneau cédez-le-passage",
          "Panneau priorité à droite",
        ],
        correctAnswer: "Panneau priorité à droite",
      },
    ],
  },
  {
    title: "Code de la route - Niveau avancé",
    questions: [
      {
        questionText: "Dans quel cas doit-on allumer les feux de croisement ?",
        options: ["De nuit seulement", "Par temps de pluie", "Toujours"],
        correctAnswer: "Par temps de pluie",
      },
      {
        questionText: "Quelle est la signification d'une ligne continue ?",
        options: [
          "Dépassement interdit",
          "Zone de stationnement",
          "Route à sens unique",
        ],
        correctAnswer: "Dépassement interdit",
      },
    ],
  },
];

const seederDatabase = async () => {
  try {
    await Quiz.deleteMany(); // Supprime les anciens quiz
    await Quiz.insertMany(quizzes); // Insère les nouveaux quiz
    await Course.deleteMany();
    await Course.insertMany(courses);
    console.log("✅ Base de données peuplée avec succès !");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
    mongoose.connection.close();
  }
};

seederDatabase();
