import { useContext } from "react";
import { FavoritesContext } from "../context/favoritesContext";

//added a custom hook just so that I can call it on my components.
export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
