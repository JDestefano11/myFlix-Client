import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);

  const fetchMovies = async () => {
    setLoadingMovies(true);
    try {
      const response = await fetch(
        "https://moviesflix-hub-fca46ebf9888.herokuapp.com/movies",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data);
      setLoadingMovies(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoadingMovies(false);
      // Handle error (e.g., show error message)
    }
  };

  const handleLogin = async (userData, authToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    fetchMovies();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setMovies([]); // Clear movies when logging out
    setSelectedMovie(null); // Reset selected movie when logging out
  };

  const handleMovieClick = (movieData) => {
    setSelectedMovie(movieData);
  };

  return (
    <BrowserRouter>
      <Row className="justify-content-center">
        <Routes>
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Col md={5}>
                  <SignupView
                    onSignup={(userData, authToken) =>
                      handleLogin(userData, authToken)
                    }
                  />
                </Col>
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Col md={5}>
                  <LoginView onLoggedIn={(user) => setUser(user)} />
                </Col>
              )
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0 ? (
                <Col>The movie list is empty!</Col>
              ) : (
                <Col md={8}>
                  <MovieView movies={movies} />
                </Col>
              )
            }
          />
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <>
                  <div>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                  {selectedMovie ? (
                    <MovieView
                      movie={selectedMovie}
                      onBackClick={() => setSelectedMovie(null)}
                    />
                  ) : (
                    <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                      {isLoadingMovies ? (
                        <div>Loading...</div>
                      ) : movies.length === 0 ? (
                        <div>The movie list is empty</div>
                      ) : (
                        movies.map((movie) => (
                          <Col key={movie.id} className="mb-4">
                            <MovieCard
                              movie={movie}
                              onMovieClick={() => setSelectedMovie(movie)}
                            />
                          </Col>
                        ))
                      )}
                    </Row>
                  )}
                </>
              )
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
