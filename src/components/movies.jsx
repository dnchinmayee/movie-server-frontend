import { useEffect, useState } from 'react';
import { apiRoutes } from './constants';

const MoviesData = [
    {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        year: 2010,
        rating: 8.8
    },
    {
        id: 2,
        title: "The Godfather",
        genre: "Crime",
        director: "Francis Ford Coppola",
        year: 1972,
        rating: 9.2
    },
    {
        id: 3,
        title: "Pulp Fiction",
        genre: "Crime",
        director: "Quentin Tarantino",
        year: 1994,
        rating: 8.9
    }
];

const Movies = () => {
    const [movies, setMovies] = useState(MoviesData);
    const [searchTitle, setSearchTitle] = useState("");
    const [allMovies, setAllMovies] = useState([]);

    // Initially fetch all movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(apiRoutes.movies);
                const data = await response.json();
                setAllMovies(data);
                setMovies(data);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setAllMovies(MoviesData);
                setMovies(MoviesData);
            }
        };
        fetchMovies();
    }, []);

    const handleSearch = () => {
        if (!searchTitle.trim()) {
            // If search is empty, show all movies
            setMovies(allMovies);
        } else {
            // Filter movies based on title
            const filteredMovies = allMovies.filter(movie =>
                movie.title.toLowerCase().includes(searchTitle.toLowerCase())
            );
            setMovies(filteredMovies);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Movies List</h2>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter movie title to search" 
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSearch}
                        >
                            Search Movies
                        </button>
                    </div>
                </div>
            </div>

            {movies.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.director}</td>
                                <td>{movie.year}</td>
                                <td>{movie.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-info">
                    No movies found with the given title. Try a different search term.
                </div>
            )}
        </div>
    );
};

export default Movies;
