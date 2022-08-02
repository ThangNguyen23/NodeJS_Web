import styled, {ThemeProvider} from "styled-components"
import Menu from "./components/Menu.jsx";
import Navbar from "./components/Navbar.jsx";
import {darkTheme, lightTheme} from "./utils/Theme.js";
import {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx"
import Video from "./pages/Video.jsx";
import SigIn from "./pages/SignIn.jsx";
import Search from "./pages/Search.jsx";

const Container = styled.div`
  display: flex;
`

const Main = styled.div`
  flex: 7;
  background-color: #181818;
  background-color: ${({theme}) => theme.bg};
`

const Wrapper = styled.div`
  padding: 22px 96px;
`

function App() {
    // switch mode
    const [darkMode, setDarkMode] = useState(true)

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Container>
                <BrowserRouter>
                    <Menu darkMode={darkMode} setDarkMode={setDarkMode}/>
                    <Main>
                        <Navbar/>
                        <Wrapper>
                            <Routes path="/">
                                <Route index element={<Home type="random"/>}/>
                                <Route path="trends" element={<Home type="trend"/>}/>
                                <Route path="subscriptions" element={<Home type="sub"/>}/>
                                <Route path="search" element={<Search/>}/>
                                <Route path="signin" element={<SigIn/>}/>
                                <Route path="video">
                                    <Route path=":id" element={<Video/>}/>
                                </Route>
                            </Routes>
                        </Wrapper>
                    </Main>
                </BrowserRouter>
            </Container>
        </ThemeProvider>
    );
}

export default App;
