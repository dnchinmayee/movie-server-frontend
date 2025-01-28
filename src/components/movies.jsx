import { useEffect, useState } from 'react';
import { apiRoutes } from './constants';

// const MoviesData = [
//     {
//         id: 1,
//         title: "Inception",
//         genre: "Sci-Fi",
//         director: "Christopher Nolan",
//         year: 2010,
//         rating: 8.8
//     },
//     {
//         id: 2,
//         title: "The Godfather",
//         genre: "Crime",
//         director: "Francis Ford Coppola",
//         year: 1972,
//         rating: 9.2
//     },
//     {
//         id: 3,
//         title: "Pulp Fiction",
//         genre: "Crime",
//         director: "Quentin Tarantino",
//         year: 1994,
//         rating: 8.9
//     }
// ];
const Movies = () => {
    const [movies, setMovies] = useState([])

    console.log(apiRoutes.movies)

    const GetMovies = async () => {
        try {
            const resp = await fetch(apiRoutes.movies)
            console.log(resp)
            if (!resp.ok) {
                console.log("Error fetching data: ", resp)
                return
            }

            const result = await resp.json();
            console.log("Result: ", result)
            setMovies(result)
        } catch (error) {
            console.log("Error: ", error)
        }

    };

    useEffect( () => {
        GetMovies()
    }, [])



    return (
        <div className="container mt-4">
            <h2>Movies List</h2>
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
        </div>
    );
};

export default Movies;
