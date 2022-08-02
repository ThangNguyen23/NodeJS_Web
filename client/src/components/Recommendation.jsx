import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import axios from "axios";
import Card from "./Card.js";

const Container = styled.div`
  flex: 2;
`

const Recommendation = ({tags}) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/tags?tags=${tags}`);
            setVideos(res.data);
        };
        fetchVideos()
    }, [tags])

    return (
        <Container>
            {videos.map((video) => (
                <Card key={video._id} type="sm" video={video}/>
            ))}
        </Container>
    );
};

export default Recommendation;