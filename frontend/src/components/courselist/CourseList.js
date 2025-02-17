import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CourseList.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      console.error("No token found, the user might not be logged in.");
      return; // If no token is found, stop the execution
    }

    setIsLoading(true); // Set loading to true before fetching data

    axios
      .get("http://localhost:5000/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
        },
      })
      .then((response) => {
        setCourses(response.data);
        setIsLoading(false); // Stop loading after successful fetch
      })
      .catch((error) => {
        console.error("Error loading courses", error);
        setIsLoading(false); // Stop loading in case of error
      });
  }, []);

  // Calculate the courses for the current page
  const coursesPerPage = 1; // Set the number of courses per page (adjust as needed)
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Handle next page navigation
  const handleNextPage = () => {
    if (currentPage < Math.ceil(courses.length / coursesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Courses</h2>
      {/* Display loading state */}
      {isLoading ? (
        <p className="text-center">Loading courses...</p>
      ) : (
        <div className="course-row">
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <div key={course._id} className="col-md-6 mb-4">
                <div className="course-card">
                  <div className="course-card-body">
                    <h5 className="course-card-title">{course.title}</h5>
                    <p className="course-card-text">{course.description}</p>
                    {course.videoURL && (
                      <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          className="embed-responsive-item"
                          src={course.videoURL}
                          title={course.title}
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">There are no available courses</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="btn btn-pagination btn-primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(courses.length / coursesPerPage)}
        </span>
        <button
          className="btn btn-pagination btn-primary"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
        >
          Next
        </button>
      </div>

      {/* Navigate to quiz page */}
      <button
        onClick={() => navigate("/quiz")}
        className="btn btn-success mt-4"
      >
        Time to practice
      </button>
    </div>
  );
};

export default CourseList;
