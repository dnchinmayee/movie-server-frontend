import { useState, useEffect } from 'react';
import { apiRoutes } from './constants';
import './AddMovie.css';

const AddMovie = ({ onMovieAdded }) => {
    const [showModal, setShowModal] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        genre: '',
        director: '',
        year: new Date().getFullYear(),
        rating: 0
    });

    useEffect(() => {
        if (showModal) {
            // Prevent background scrolling when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const handleInputChange = (field, value) => {
        setNewMovie(prev => ({
            ...prev,
            [field]: field === 'rating' ? parseFloat(value) || 0 : 
                     field === 'year' ? parseInt(value) || new Date().getFullYear() : 
                     value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(apiRoutes.movies, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMovie)
            });

            if (response.ok) {
                const addedMovie = await response.json();
                onMovieAdded(addedMovie);
                setShowModal(false);
                setNewMovie({
                    title: '',
                    genre: '',
                    director: '',
                    year: new Date().getFullYear(),
                    rating: 0
                });
            } else {
                console.error('Failed to add movie');
            }
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setNewMovie({
            title: '',
            genre: '',
            director: '',
            year: new Date().getFullYear(),
            rating: 0
        });
    };

    return (
        <>
            <button 
                className="btn btn-primary mb-3" 
                onClick={() => setShowModal(true)}
            >
                Add New Movie
            </button>

            {showModal && (
                <div className="modal-backdrop" onClick={handleClose}>
                    <div className="add-movie-modal" onClick={e => e.stopPropagation()}>
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Add New Movie</h5>
                                <button 
                                    className="btn btn-close" 
                                    onClick={handleClose}
                                />
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newMovie.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Genre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newMovie.genre}
                                                onChange={(e) => handleInputChange('genre', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Director</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newMovie.director}
                                                onChange={(e) => handleInputChange('director', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Year</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newMovie.year}
                                                onChange={(e) => handleInputChange('year', e.target.value)}
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Rating</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newMovie.rating}
                                                onChange={(e) => handleInputChange('rating', e.target.value)}
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Add Movie
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddMovie;
