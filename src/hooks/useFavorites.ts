import { useContext } from "react";
import { FavoritesContext } from "../context/favoritesContextValue";

export function useFavorites() {
  // This lets components use the favorites context with one simple hook.
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
