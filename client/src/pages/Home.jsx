import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Card from "../components/Card.js";
import axios from "axios";
import {useLocation} from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Home = ({type}) => {
    const [videos, setVideos] = useState([])

    // run 1 time when refresh page
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/${type}`)
            setVideos(res.data)
        }
        fetchVideos()
    }, [type])

    return (
        <Container>
            {videos.map((video) => (
                <Card key={video._id} video={video}/>
            ))}
        </Container>
    );
};

export default Home;