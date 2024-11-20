import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { getBooks } from '../backend/googleBooksApi';

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data.items); // Sets book data
      } catch (err) {
        setError(err.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Return nothing if loading, handle error separately
  if (loading) {
    return null;
  }

  if (error) {
    setBooks([]); // Optional: Clear books on error
    return null; // Optionally return null or a custom error message
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {books.map((book, index) => {
        const bookInfo = book.volumeInfo;
        const averageRating = bookInfo.averageRating || 0; // Default to 0 if no rating
        const imageUrl = bookInfo.imageLinks?.thumbnail || '/placeholder.jpg'; // Use placeholder if no image

        return (
          <Card key={index} className="max-w-sm bg-white shadow-lg rounded-lg">
            <CardMedia
              component="img"
              alt={bookInfo.title}
              height="250"
              image={imageUrl}
              title={bookInfo.title}
            />
            <CardContent>
              <Typography variant="h6" component="div" className="text-lg font-semibold">
                {bookInfo.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bookInfo.authors?.join(', ') || 'Unknown Author'}
              </Typography>

              {/* Rating display */}
              {averageRating > 0 && (
                <Box mt={2} display="flex" alignItems="center">
                  <Rating value={averageRating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" className="ml-2">
                    {averageRating} / 5
                  </Typography>
                </Box>
              )}

              {/* Book Description */}
              <Typography variant="body2" color="text.secondary" className="mt-2">
                {bookInfo.description ? bookInfo.description.slice(0, 100) + '...' : 'No description available'}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Home;
