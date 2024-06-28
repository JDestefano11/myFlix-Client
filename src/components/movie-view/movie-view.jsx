import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./movie-view.scss";

export const MovieView = ({ movie }) => {
    return (
        <div className="movie-view">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <img src={movie.ImageUrl} alt={movie.Title} className="movie-poster" />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <div className="movie-details">
                            <h2>{movie.Title}</h2>
                            <p><strong>Description:</strong> {movie.Description}</p>
                            {movie.Genre && (
                                <div>
                                    <p><strong>Genre:</strong> {movie.Genre.Name}</p>
                                    <p><strong>Genre Description:</strong> {movie.Genre.Description}</p>
                                </div>
                            )}
                            {movie.Director && (
                                <div>
                                    <p><strong>Director:</strong> {movie.Director.Name}</p>
                                    <p><strong>Director's Occupation:</strong> {movie.Director.Occupation}</p>
                                    <p><strong>Director's Birthdate:</strong> {new Date(movie.Director.BirthDate).toLocaleDateString()}</p>
                                    <p><strong>Director's Birthplace:</strong> {movie.Director.BirthPlace}</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Link to="/" className="back-button">
                Back
            </Link>
        </div>
    );
};


