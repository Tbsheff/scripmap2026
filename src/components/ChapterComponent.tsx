import { useLoaderData } from "react-router-dom";
import "./ChapterComponent.css";

export default function ChapterComponent() {
    const chapterHtml = useLoaderData();

    return (
        <div className="with-nav-buttons">
            <div className="chapter-content" dangerouslySetInnerHTML={{ __html: chapterHtml }} />
        </div>
    );
}
