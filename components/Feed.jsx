import PostComposer from "./PostComposer";
import Post from "./Post";

export default function Feed() {
    return (
        <div>
            <PostComposer />
            <Post />
            <Post />
        </div>
    );
}
