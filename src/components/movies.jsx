import { useEffect, useState } from 'react';
import { apiRoutes } from './constants';
import MovieSearch from './MovieSearch';
import AddMovie from './AddMovie';
import './Movies.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [editedMovie, setEditedMovie] = useState({
        title: "",
        genre: "",
        director: "",
        year: 1970,
        rating: 0
    });

    // Initially fetch all movies
    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch(apiRoutes.movies);
            const data = await response.json();
            console.log(data);
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie.id);
        setEditedMovie({
            title: movie.title,
            genre: movie.genre,
            director: movie.director,
            year: movie.year,
            rating: movie.rating
        });
    };

    const handleUpdate = async () => {
        const movieToUpdate = {
            ...editedMovie,
            rating: parseFloat(editedMovie.rating) || 0,
            year: parseInt(editedMovie.year) || 1970
        };
        
        console.log(movieToUpdate);
        try {
            const response = await fetch(`${apiRoutes.movies}/${editingMovie}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieToUpdate)
            });

            if (response.ok) {
                const updatedMovies = movies.map(movie =>
                    movie.id === editingMovie ? { ...movie, ...movieToUpdate } : movie
                );
                setMovies(updatedMovies);
                setEditingMovie(null);
            } else {
                console.error('Failed to update movie');
            }
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    const handleDelete = async (movieId) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) {
            return;
        }

        try {
            const response = await fetch(`${apiRoutes.movies}/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
            } else {
                console.error('Failed to delete movie');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedMovie(prev => ({
            ...prev,
            [field]: field === 'rating' ? parseFloat(value) || 0 : 
                     field === 'year' ? parseInt(value) || 1970 : 
                     value
        }));
    };

    const handleSearchResults = (searchResults) => {
        setMovies(searchResults);
    };

    const handleMovieAdded = (newMovie) => {
        setMovies(prevMovies => [...prevMovies, newMovie]);
    };

    return (
        <div className="container mt-4">
            <h2>Movies List</h2>
            <AddMovie onMovieAdded={handleMovieAdded} />
            <MovieSearch onSearch={handleSearchResults} />
            {movies.length > 0 ? (
                <div className="movies-table-container">
                    <table className="table table-striped table-bordered movies-table">
                        <thead className="table-dark">
                            <tr>
                                <th className="col-id">ID</th>
                                <th className="col-title">Title</th>
                                <th className="col-genre">Genre</th>
                                <th className="col-director">Director</th>
                                <th className="col-year">Year</th>
                                <th className="col-rating">Rating</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map(movie => (
                                <tr key={movie.id}>
                                    <td className="col-id">{movie.id}</td>
                                    <td className="col-title">
                                        {editingMovie === movie.id ? (
                                            <input 
                                                type="text"
                                                value={editedMovie.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            movie.title
                                        )}
                                    </td>
                                    <td className="col-genre">
                                        {editingMovie === movie.id ? (
                                            <input 
                                                type="text"
                                                value={editedMovie.genre}
                                                onChange={(e) => handleInputChange('genre', e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            movie.genre
                                        )}
                                    </td>
                                    <td className="col-director">
                                        {editingMovie === movie.id ? (
                                            <input 
                                                type="text"
                                                value={editedMovie.director}
                                                onChange={(e) => handleInputChange('director', e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            movie.director
                                        )}
                                    </td>
                                    <td className="col-year">
                                        {editingMovie === movie.id ? (
                                            <input 
                                                type="number"
                                                value={editedMovie.year}
                                                onChange={(e) => handleInputChange('year', e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            movie.year
                                        )}
                                    </td>
                                    <td className="col-rating">
                                        {editingMovie === movie.id ? (
                                            <input 
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                value={editedMovie.rating}
                                                onChange={(e) => handleInputChange('rating', e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            movie.rating
                                        )}
                                    </td>
                                    <td className="col-actions">
                                        {editingMovie === movie.id ? (
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={handleUpdate}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingMovie(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="btn-group">
                                                <button 
                                                    className="btn btn-warning btn-sm" 
                                                    onClick={() => handleEdit(movie)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm" 
                                                    onClick={() => handleDelete(movie.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info">
                    No movies found with the given title. Try a different search term.
                </div>
            )}
        </div>
    );
};

export default Movies;