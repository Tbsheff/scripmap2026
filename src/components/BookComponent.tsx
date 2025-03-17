import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useScripturesDataContext } from "../context/ScripturesDataContextHook";
import { BookProps } from "../Types";
import LoadingIndicator from "./LoadingIndicator";
import { CLASS_BUTTON } from "../Constants";

export default function BookComponent(props: BookProps) {
    const { isLoading, books } = useScripturesDataContext();
    const { bookId } = useParams();
    const [book, setBook] = useState(props.book);

    useEffect(() => {
        if (!book && !isLoading && books && bookId) {
            setBook(books[bookId]);
        }
    }, [book, bookId, books, isLoading]);

    if (isLoading || !books || !book) {
        return <LoadingIndicator />;
    }

    if (book.numChapters <= 1) {
        return <div>Need to redirect to the chapter component.</div>;
    }

    const chaptersList = [];
    let chapter = 1;

    while (chapter <= book.numChapters) {
        chaptersList.push(
            <Link
                className={`${CLASS_BUTTON} chapter-btn`}
                id={`c${chapter}`}
                key={`k${chapter}`}
                to={`/${book.parentBookId}/${book.id}/${chapter}`}
            >
                {chapter}
            </Link>
        );
        chapter += 1;
    }

    return (
        <div className="booksContainer">
            <div className="volume">
                <h5>{book.fullName}</h5>
            </div>
            <div className="books padded">{chaptersList}</div>
        </div>
    );
}
