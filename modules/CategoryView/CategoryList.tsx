import { Col, Row } from "react-bootstrap";
import { categoryIconColor } from ".";
import { Category, PublicProps } from "../interfaces";
import { SideLine } from "../utils";
import { CategoryView } from "./CategoryView";

const CategoryListElement = ({ category }: { category:Category }) => {
    return <Row>
        <Col xs={12} sm={2}>
            <SideLine 
                icon={category.icon?category.icon:"fab fa-cuttlefish"}
                color={category.color?category.color:categoryIconColor}
                category_id={category._id} />
        </Col>
        <Col xs={12} sm={10}>
            <CategoryView category={category} key={category._id} />
        </Col>
    </Row>
}

export const CategoryList = ({ infos }: PublicProps) => {
    return <>
        {infos.categories.map((c) => <CategoryListElement category={c} />)}
    </>
}