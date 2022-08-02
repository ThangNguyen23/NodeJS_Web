import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import app from "../firebase.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0000007a;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({theme}) => theme.bgLighter};
  color: ${({theme}) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  border-radius: 5px;
`

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`

const Title = styled.h1`
  text-align: center;
`

const Input = styled.input`
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`

const Desc = styled.textarea`
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.textSoft};
`

const Label = styled.label`
  font-size: 17px;
`

const Upload = ({setOpen}) => {
    const [img, setImg] = useState(undefined)
    const [video, setVideo] = useState(undefined)

    const [imgPerc, setImgPerc] = useState(0)
    const [videoPerc, setVideoPerc] = useState(0)

    const [inputs, setInputs] = useState({})
    const [tag, setTag] = useState([])

    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs(prev => {
            return {...prev, [e.target.name]: e.target.value}
        })
    }

    const handleText = (e) => {
        setTag(e.target.value.split(','))
    }

    // using firebase
    const uploadFile = (file, urlType) => {
        const storage = getStorage(app)
        // avoid conflict file name
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => {throw error},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return {...prev, [urlType]: downloadURL};
                    });
                })
            }
        )
    }

    useEffect(() => {video && uploadFile(video, 'videoUrl')}, [video])
    useEffect(() => {img && uploadFile(img, 'imgUrl')}, [img])

    const handleUpload = async (e) => {
        e.preventDefault()
        const res = await axios.post('/videos', {...inputs, tag})
        setOpen(false)
        // res.status === 200 && (navigate(`/video/${res.data._id}`))
        res.status === 200 && navigate('/')
        navigate(0)
    }

    return (
        <Container>
            {/*popup screen*/}
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload a new video</Title>
                <Label>Video:</Label>
                {/*just upload 1 video*/}
                {videoPerc > 0 ? ('Uploading:' + videoPerc + '%') : (<Input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])}/>)}
                <Input type="text" placeholder="Title" name="title" onChange={handleChange}/>
                <Desc placeholder="Description" row={8} name="desc" onChange={handleChange}/>
                <Input type="text" placeholder="Separate the tags with commas" onChange={handleText}/>
                <Label>Image:</Label>
                {/*just upload 1 image*/}
                {imgPerc > 0 ? ('Uploading:' + imgPerc + '%') : (<Input type="file" accept="image/*" onChange={e => setImg(e.target.files[0])}/>)}
                <Button onClick={handleUpload}>Upload</Button>
            </Wrapper>
        </Container>
    );
};

export default Upload;