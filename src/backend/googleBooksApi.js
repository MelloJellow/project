export const getBooks = async(topic) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${topic}` );
    const data =await response.json();
    return data;
}