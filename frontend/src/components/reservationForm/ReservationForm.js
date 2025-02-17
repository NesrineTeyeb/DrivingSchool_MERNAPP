import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Alert, Card } from "react-bootstrap";

const ReservationForm = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [existingReservation, setExistingReservation] = useState(null);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const checkExistingReservation = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:5000/api/reservations/user/${userEmail}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.length > 0) {
          setHasReservation(true);
          setExistingReservation(response.data[0]);
        }
      } catch (err) {
        console.error("Error checking reservations:", err);
      }
    };

    if (userEmail) {
      checkExistingReservation();
    }
  }, [userEmail]);

  const initialValues = {
    name: "",
    email: userEmail || "",
    phone: "",
    date: "",
    lessonType: "",
    notes: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Must be a valid phone number")
      .required("Phone is required"),
    date: Yup.date()
      .min(new Date(), "The date must be in the future") // Validation pour la date future
      .required("Please select a date"),
    lessonType: Yup.string()
      .oneOf(["Beginner", "Advanced"], "Invalid lesson type")
      .required("Lesson type is required"),
    notes: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const token = localStorage.getItem("authToken"); // Récupérer le token dans le localStorage
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reservations", // Ton endpoint backend
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
          },
        }
      );
      console.log(response);
      setFormValues(values); // Sauvegarder les valeurs pour le modal de confirmation
      setShowModal(true); // Afficher le modal après la réussite de la réservation
      resetForm();
    } catch (error) {
      console.error("Reservation error:", error);
      alert(
        "Error making reservation: " + (error.response?.data?.error || error.message)
      );
    }
    setSubmitting(false);
  };

  const handleModalClose = () => {
    setShowModal(false); // Close modal
    navigate("/payment"); // Redirect to payment page after closing modal
  };

  // Get the current date in YYYY-MM-DD format to use as the min value for the date field
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-4">
      {hasReservation ? (
        <Card className="text-center">
          <Card.Header>
            <h3>Réservation Existante</h3>
          </Card.Header>
          <Card.Body>
            <Card.Title>Vous avez déjà une réservation en cours</Card.Title>
            <Card.Text>
              Date: {new Date(existingReservation?.date).toLocaleDateString()}
              <br />
              Type de leçon: {existingReservation?.lessonType}
            </Card.Text>
            <Link to="/my-reservations" className="btn btn-primary">
              See my reservation
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <>
          <h2>Book a Driving Lesson and access to the courses and quizzes</h2>
          {error && (
            <Alert variant="warning" className="mt-3">
              {error}
            </Alert>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="p-4 border rounded shadow">
                <div className="mb-3">
                  <label>Name</label>
                  <Field type="text" name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <Field 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    disabled={true}
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label>Phone</label>
                  <Field type="text" name="phone" className="form-control" />
                  <ErrorMessage name="phone" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label>Preferred Date</label>
                  <Field
                    type="date"
                    name="date"
                    className="form-control"
                    min={today} // Désactive les dates passées
                  />
                  <ErrorMessage name="date" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label>Lesson Type</label>
                  <Field as="select" name="lessonType" className="form-control">
                    <option value="">Select</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Advanced">Advanced</option>
                  </Field>
                  <ErrorMessage
                    name="lessonType"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label>Additional Notes</label>
                  <Field as="textarea" name="notes" className="form-control" />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Reservation"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reservation Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your reservation has been successfully booked with the following details:</p>
          <ul>
            <li><strong>Name:</strong> {formValues?.name}</li>
            <li><strong>Email:</strong> {formValues?.email}</li>
            <li><strong>Phone:</strong> {formValues?.phone}</li>
            <li><strong>Date:</strong> {formValues?.date}</li>
            <li><strong>Lesson Type:</strong> {formValues?.lessonType}</li>
            <li><strong>Notes:</strong> {formValues?.notes}</li>
          </ul>
          <p>You will now be redirected to the payment page.</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Proceed to Payment
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReservationForm;
