// src/components/PaymentForm.js
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './PaymentForm.css'
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name,setName]=useState('');// state pour gérer le nom
  const navigate=useNavigate("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    // Récupérer les informations de carte saisies
    const cardElement = elements.getElement(CardElement);

    // Créer un PaymentMethod avec Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    try {
      // Envoyer le PaymentMethod ID et le montant au backend
      const response = await axios.post("http://localhost:5000/api/payment", {
        amount: 50, // Montant en euros, par exemple 50€
        currency: "eur",
        paymentMethodId: paymentMethod.id,
        name,
      });

      if (response.data.success) {
        setMessage("Paiement réussi !");
        navigate("/courses")      
      } else {
        setMessage(response.data.error || "Erreur lors du paiement");
      }
    } catch (err) {
      setMessage("Erreur serveur lors du paiement");
    }

    setLoading(false);
  };

   return (
    <div className="payment-form-container">
      <h2>Paiement Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Champ pour le nom de l'utilisateur */}
        <div>
          <label htmlFor="name">Name :</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Card Number Name"
            required
          />
        </div>

        {/* CardElement de Stripe pour le paiement */}
        <div>
          <label htmlFor="card">Card Information:</label>
          <CardElement
            id="card"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  letterSpacing: '0.025em',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  padding: '10px', // Vous pouvez ajouter du padding pour plus d'espace
                },
                invalid: {
                  color: '#9e2146',
                },
                number: {
                  // Styles spécifiques pour le numéro de carte
                  fontSize: '16px',
                  color: '#333',
                  padding: '10px',  // Ajuste l'espace à l'intérieur du champ
                },
                cvc: {
                  // Styles spécifiques pour le CVC
                  fontSize: '16px',
                  color: '#333',
                  padding: '10px',
                },
                expiry: {
                  // Styles spécifiques pour la date d'expiration
                  fontSize: '16px',
                  color: '#333',
                  padding: '10px',
                },
              },
              placeholders: {
                number: "Enter your Card Number", // Texte du placeholder pour le numéro de carte
                cvc: "CVC", // Texte du placeholder pour le CVC
                expiry: "MM/AAAA", // Texte du placeholder pour la date d'expiration
              },
            }}
          />
        </div>
        

        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Traitement..." : "Payer"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";


// // import usePaymentContext from "../../context/PaymentContext"
// import { usePaymentContext } from '../../context/PaymentContext';

// const PaymentForm = () => {
//   const { updatePaymentStatus } = usePaymentContext(); // Accéder à la fonction pour mettre à jour l'état
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [cardHolderName, setCardHolderName] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(""); // Success message state
//   const navigate = useNavigate();

//   // Validation de paiement
//   const validateForm = () => {
//     if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
//       setError("Tous les champs sont obligatoires.");
//       return false;
//     }
//     if (!/^\d{16}$/.test(cardNumber)) {
//       setError("Le numéro de carte doit comporter 16 chiffres.");
//       return false;
//     }
//     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
//       setError("La date d'expiration doit être au format MM/AA.");
//       return false;
//     }
//     if (!/^\d{3}$/.test(cvv)) {
//       setError("Le CVV doit comporter 3 chiffres.");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       const paymentData = {
//         cardNumber,
//         expiryDate,
//         cvv,
//         cardHolderName,
//       };

//       try {
//         const response = await axios.post("http://localhost:5000/api/payment", paymentData);
//         updatePaymentStatus(true);
//         setSuccess(response.data.message || "Paiement réussi !");
//         setTimeout(() => {
//           navigate("/courses");
//         }, 2000);
//       } catch (err) {
//         setError(err.response?.data?.error || "Erreur lors du traitement du paiement.");
//       }
//     }
//   };

//   return (
//     <div>
//        {/* Passer la navbar avec la mise à jour du paiement */}
//       <div className="payment-form">
//         <h2>Formulaire de Paiement</h2>
//         {error && <p className="error">{error}</p>}
//         {success && <p className="success">{success}</p>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="cardNumber">Numéro de carte</label>
//             <input
//               type="text"
//               id="cardNumber"
//               value={cardNumber}
//               onChange={(e) => setCardNumber(e.target.value)}
//               maxLength="16"
//               placeholder="Entrez votre numéro de carte"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="expiryDate">Date d'expiration (MM/AA)</label>
//             <input
//               type="text"
//               id="expiryDate"
//               value={expiryDate}
//               onChange={(e) => setExpiryDate(e.target.value)}
//               maxLength="5"
//               placeholder="MM/AA"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="cvv">CVV</label>
//             <input
//               type="text"
//               id="cvv"
//               value={cvv}
//               onChange={(e) => setCvv(e.target.value)}
//               maxLength="3"
//               placeholder="123"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="cardHolderName">Nom du titulaire</label>
//             <input
//               type="text"
//               id="cardHolderName"
//               value={cardHolderName}
//               onChange={(e) => setCardHolderName(e.target.value)}
//               placeholder="Entrez le nom du titulaire"
//             />
//           </div>

//           <button type="submit">Payer</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;



// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import NavigationBar from "../navbar/NavigationBar"; // Import Navbar

// // const PaymentForm = () => {
// //   const [paymentStatus, setPaymentStatus] = useState(false); // State to track payment
// //   const [cardNumber, setCardNumber] = useState("");
// //   const [expiryDate, setExpiryDate] = useState("");
// //   const [cvv, setCvv] = useState("");
// //   const [cardHolderName, setCardHolderName] = useState("");
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState(""); // Success message state
// //   const navigate = useNavigate(); 

// //   // Payment validation
// //   const validateForm = () => {
// //     if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
// //       setError("Tous les champs sont obligatoires.");
// //       return false;
// //     }
// //     if (!/^\d{16}$/.test(cardNumber)) {
// //       setError("Le numéro de carte doit comporter 16 chiffres.");
// //       return false;
// //     }
// //     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
// //       setError("La date d'expiration doit être au format MM/AA.");
// //       return false;
// //     }
// //     if (!/^\d{3}$/.test(cvv)) {
// //       setError("Le CVV doit comporter 3 chiffres.");
// //       return false;
// //     }
// //     setError("");
// //     return true;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     if (validateForm()) {
// //       console.log("Formulaire validé, envoyer les données :", {
// //         cardNumber,
// //         expiryDate,
// //         cvv,
// //         cardHolderName,
// //       });

// //       // Simulate successful payment
// //       setPaymentStatus(true); // Set paymentStatus to true after successful payment
// //       setSuccess("Paiement réussi !");
// //       setTimeout(() => {
// //         navigate("/"); // Redirect to homepage after payment
// //       }, 2000);
// //     }
// //   };

// //   return (
// //     <div>
// //       <NavigationBar paymentStatus={paymentStatus} /> {/* Pass paymentStatus as prop */}
// //       <div className="payment-form">
// //         <h2>Formulaire de Paiement</h2>
// //         {error && <p className="error">{error}</p>}
// //         {success && <p className="success">{success}</p>}

// //         <form onSubmit={handleSubmit}>
// //           <div className="form-group">
// //             <label htmlFor="cardNumber">Numéro de carte</label>
// //             <input
// //               type="text"
// //               id="cardNumber"
// //               value={cardNumber}
// //               onChange={(e) => setCardNumber(e.target.value)}
// //               maxLength="16"
// //               placeholder="Enter your Card Number"
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label htmlFor="expiryDate">Date d'expiration (MM/AA)</label>
// //             <input
// //               type="text"
// //               id="expiryDate"
// //               value={expiryDate}
// //               onChange={(e) => setExpiryDate(e.target.value)}
// //               maxLength="5"
// //               placeholder="MM/AA"
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label htmlFor="cvv">CVV</label>
// //             <input
// //               type="text"
// //               id="cvv"
// //               value={cvv}
// //               onChange={(e) => setCvv(e.target.value)}
// //               maxLength="3"
// //               placeholder="123"
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label htmlFor="cardHolderName">Nom du titulaire</label>
// //             <input
// //               type="text"
// //               id="cardHolderName"
// //               value={cardHolderName}
// //               onChange={(e) => setCardHolderName(e.target.value)}
// //               placeholder="Enter your Card Name"
// //             />
// //           </div>

// //           <button type="submit">Payer</button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PaymentForm;
