import { ListElement, listRender } from "."
import { Post } from "../../interfaces"
import { CategoryButton, PostDate, Star } from "../../Posts"
import { getCategory, marktext_to_plain } from "../../utils"
import { PostEdit, PanePopup } from "../EditPanes"

export const ListPost = ({ values }:{ values: Post[] }) => {
    const PostElement = ({value}:{value:Post}) => {
        return <PanePopup show={<PostEdit post={value} />}>
            {open => <ListElement
                title={value.title}
                metas={<>
                    <PostDate post_date={value.date} post_end_date={value.end_date} />
                    <CategoryButton category={getCategory(value.category)} />
                    <Star star={value.star} />
                </>}
                text={marktext_to_plain(value.description)}
                onClick={open}
            />}
        </PanePopup>
    }
    return listRender(PostElement,values)
}