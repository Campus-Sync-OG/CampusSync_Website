import React, { useState } from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { useNavigate } from "react-router-dom";
import { uploadWithMetadata } from "../api/ClientApi"; // Adjust the import path as necessary

const Container = styled.div`
  padding: 0 15px;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 2px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  h1 {
    font-size: 26px;
    font-weight: 600;
    font-family: "Poppins";
  }
`;

const Form = styled.form`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  color: #002e9f;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;

  & > div {
    flex: 1 1 30%;
    margin: 10px;
    min-width: 250px;
  }
`;

const Input = styled.input`
  padding: 12px;
  width: 90%;
  border: none;
  border-radius: 5px;
  background-color: #f1f2f7;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #888;
  }
`;

const Select = styled.select`
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #f1f2f7;
  font-size: 14px;
  color: #333;
  outline: none;
`;

const ButtonGroup = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 30px;
  border: none;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  background-color: ${(props) =>
    props.variant === "reset" ? "#002e9f" : "#d60000"};
  cursor: pointer;
`;

const IconButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconBtn = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Divider = styled.div`
  height: 25px;
  width: 2px;
  background-color: white;
`;

const AdminGallery = () => {
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [imageMetadata, setImageMetadata] = useState({ date: "", title: "" });

  const [videoFiles, setVideoFiles] = useState([]);
  const [videoMetadata, setVideoMetadata] = useState({ date: "", title: "" });

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleVideoChange = (e) => {
    setVideoFiles([...e.target.files]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      for (const file of imageFiles) {
        await uploadWithMetadata(file, {
          ...imageMetadata,
          type: "image",
        });
      }
      alert("All images uploaded successfully!");
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    try {
      for (const file of videoFiles) {
        await uploadWithMetadata(file, {
          ...videoMetadata,
          type: "video",
        });
      }
      alert("All videos uploaded successfully!");
    } catch (err) {
      alert("Video upload failed: " + err.message);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Gallery</h1>
        <IconButtons>
          <div onClick={() => navigate("/admin-dashboard")} style={{ cursor: "pointer" }}>
            <IconBtn src={homeIcon} alt="Home" title="Home" />
          </div>
          <Divider />
          <div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            <IconBtn src={backIcon} alt="Back" title="Back" />
          </div>
        </IconButtons>
      </Header>

      <Form onSubmit={handleImageUpload}>
        <SectionTitle>Add Images</SectionTitle>
        <Row>
          <div>
            <label>Date *</label>
            <Input
              type="date"
              value={imageMetadata.date}
              onChange={(e) => setImageMetadata({ ...imageMetadata, date: e.target.value })}
            />
          </div>
          <div>
            <label>Image Title *</label>
            <Input
              value={imageMetadata.title}
              onChange={(e) => setImageMetadata({ ...imageMetadata, title: e.target.value })}
            />
          </div>
          <div>
            <label>Select Attachment *</label>
            <input type="file" multiple onChange={handleImageChange} />
            <small>(Select multiple photos with ctrl/Shift key) ONLY .JPG, .JPEG & .PNG</small>
          </div>
        </Row>
        <ButtonGroup>
          <Button type="submit">Submit</Button>
          <Button type="button" variant="reset" onClick={() => setImageFiles([])}>Reset</Button>
        </ButtonGroup>
      </Form>

      <Form onSubmit={handleVideoUpload}>
        <SectionTitle>Add Videos</SectionTitle>
        <Row>
          <div>
            <label>Date *</label>
            <Input
              type="date"
              value={videoMetadata.date}
              onChange={(e) => setVideoMetadata({ ...videoMetadata, date: e.target.value })}
            />
          </div>
          <div>
            <label>Video Title *</label>
            <Input
              value={videoMetadata.title}
              onChange={(e) => setVideoMetadata({ ...videoMetadata, title: e.target.value })}
            />
          </div>
          <div>
            <label>Select Attachment *</label>
            <input type="file" multiple accept=".mp4, .4k" onChange={handleVideoChange} />
            <small>(Select multiple with ctrl/Shift key) ONLY MP4, 4K</small>
          </div>
        </Row>
        <ButtonGroup>
          <Button type="submit">Submit</Button>
          <Button type="button" variant="reset" onClick={() => setVideoFiles([])}>Reset</Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default AdminGallery;
