import { BrowserRouter, Routes,  Route} from "react-router-dom";
import Main from "../pages/Main";
import Repositorio from "../pages/Repositorio"

const Router = (() => {
    return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Main />} />
            <Route path="/repositorio/:repositorio" element={<Repositorio />} exact/>
        </Routes>
    </BrowserRouter> 
    )
})

export default Router;