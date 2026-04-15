type FavoriteRatingDialogProps = {
  movieTitle: string;
  rating: number;
  onCancel: () => void;
  onRatingChange: (rating: number) => void;
  onSave: () => void;
};

export default function FavoriteRatingDialog({
  movieTitle,
  rating,
  onCancel,
  onRatingChange,
  onSave,
}: FavoriteRatingDialogProps) {
  return (
    <div className="favorite-dialog">
      <div>
        <p className="dialog__eyebrow">Add To Favorites</p>
        <h3 className="favorite-dialog__title">How would you rate {movieTitle}?</h3>
      </div>

      <p className="favorite-dialog__label" id="favorite-rating-label">
        Personal rating
      </p>
      <div
        aria-labelledby="favorite-rating-label"
        className="favorite-dialog__stars"
        role="group"
      >
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            aria-label={`Rate ${starValue} out of 5`}
            className={`favorite-dialog__star ${starValue <= rating ? "favorite-dialog__star--active" : ""}`}
            key={starValue}
            onClick={() => onRatingChange(starValue)}
            type="button"
          >
            ★
          </button>
        ))}
      </div>
      <p className="favorite-dialog__value">{rating} / 5</p>

      <div className="dialog__actions">
        <button className="movie-card__button" onClick={onSave} type="button">
          Save favorite
        </button>
        <button
          className="movie-card__button movie-card__button--secondary"
          onClick={onCancel}
          type="button"
        >
          Back
        </button>
      </div>
    </div>
  );
}
