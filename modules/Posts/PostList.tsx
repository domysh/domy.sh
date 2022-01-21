import { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { categoryIconColor } from ".";
import { InfosContext } from "../Context/Infos";
import { Post, PublicInfo } from "../interfaces";
import { getCategory, SideLine } from "../utils";
import { PostBox } from "./PostBox";

const PostListElement = ({ post }: { post:Post }) => {
    const currentCategory = getCategory(post.category)

    return <Row>
        <Col xs={12} sm={2}>
            <SideLine 
                icon={currentCategory.icon?currentCategory.icon:"fab fa-cuttlefish"}
                color={currentCategory.color?currentCategory.color:categoryIconColor}
                category_id={currentCategory._id} />
        </Col>

        <Col xs={12} sm={10}>
            <PostBox key={post._id} post={post} />
        </Col>
    </Row>
}

export const PostList = ({ posts }: { posts:Post[] }) => {
    return <>
        {posts.map((p) => <PostListElement key={p._id} post={p} />)}
    </>
}