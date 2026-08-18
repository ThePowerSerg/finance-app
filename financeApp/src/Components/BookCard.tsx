import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Book } from "../models/book";

type Props = {
  book: Book;
};

export default function BookCard({ book }: Props) {
  return (
    <Card
      elevation={3}
      sx={{
        width: 280,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        sx={{ height: 240, width: "100%", backgroundSize: "cover" }}
        image={"tbd"}
        title={book.title}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{ textTransform: "uppercase" }}
          variant="subtitle2"
        >
          {book.title}
        </Typography>
        <Typography variant="h6" sx={{ color: "secondary.main" }}>
          ${(2000 / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button>Add to cart</Button>
        {/* <Button component={Link} to={`/catalog/${book.id}`}>View</Button> */}
      </CardActions>
    </Card>
  );
}
