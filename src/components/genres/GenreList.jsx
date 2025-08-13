import Spinner from "@/components/ui/Spinner";
import { useGenres } from "@/hooks/useGenres";

export default function GenreList({ children }) {
  const { genres, loading, error } = useGenres();

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!genres.length) return <p className="text-gray-500">No genres found.</p>;

  return children(genres);
}
