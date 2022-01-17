import { Col, Row } from "react-bootstrap";
import { categoryIconColor } from ".";
import { Post, PublicInfo } from "../interfaces";
import { getCategory, SideLine } from "../utils";
import { PostBox } from "./PostBox";

const PostListElement = ({ post, infos }: { post:Post, infos:PublicInfo }) => {
    const currentCategory = getCategory(infos,post.category)

    return <Row>
        <Col xs={12} sm={2}>
            <SideLine 
                icon={currentCategory.icon?currentCategory.icon:"fab fa-cuttlefish"}
                color={currentCategory.color?currentCategory.color:categoryIconColor}
                category_id={currentCategory._id} />
        </Col>

        <Col xs={12} sm={10}>
            <PostBox infos={infos} key={post._id} post={post} />
        </Col>
    </Row>
}

export const PostList = ({ infos, posts }: { infos:PublicInfo , posts:Post[] }) => {
    return <>
        {posts.map((p) => <PostListElement infos={infos} key={p._id} post={p} />)}
    </>
}