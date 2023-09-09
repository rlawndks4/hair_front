import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row } from "src/components/elements/styled-components";
import UserLayout from "src/layouts/user/UserLayout";
import { apiManager } from "src/utils/api-manager";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

const Post = () => {
    const router = useRouter();
    const [post, setPost] = useState({});

    useEffect(() => {
        getPost();
    }, [router])
    const getPost = async () => {
        let data = await apiManager('posts', 'get', {
            id: router.query.id
        })
        setPost(data);
    }
    return (
        <>
            <Col style={{ rowGap: '0.5rem' }}>
                <Row style={{ columnGap: '0.5rem', alignItems: 'center' }}>
                    <div>제목:</div>
                    <div>{post?.title}</div>
                </Row>
                <ReactQuill
                    className='none-padding'
                    value={post?.note ?? `<body></body>`}
                    readOnly={true}
                    theme={"bubble"}
                    bounds={'.app'}
                />
            </Col>
        </>
    )
}
Post.getLayout = (page) => <UserLayout>{page}</UserLayout>;
export default Post;