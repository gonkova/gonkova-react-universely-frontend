export default function GenreFilter({
  genres = [],
  selectedGenres = [],
  onChange,
}) {
  const toggleGenre = (genreName) => {
    if (selectedGenres.includes(genreName)) {
      onChange(selectedGenres.filter((g) => g !== genreName));
    } else {
      onChange([...selectedGenres, genreName]);
    }
  };

  if (!genres.length) {
    return (
      <p className="text-gray-500 dark:text-gray-400">No genres available.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {genres.map(({ id, name }) => (
        <li key={id} className="list-none">
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedGenres.includes(name)}
              onChange={() => toggleGenre(name)}
              className="form-checkbox"
            />
            <span>{name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
