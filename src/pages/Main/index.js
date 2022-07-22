import {useState, useCallback, useEffect} from "react"
import {Container, Form, ButtonSubmit, List, DeleteButton} from "./styles";
import {GoMarkGithub, GoPlus, GoTasklist, GoTrashcan} from "react-icons/go";
import {Link} from "react-router-dom";

import {Url_API_Git} from "../../constants/urlAPI";
import axios from "axios";

const Main = (() => {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    //buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])

    //Salvar alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios])



   const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit(){
        setLoading(true);
        setAlert(null);
        if(newRepo === ""){
            throw new Error("Favor inserir um repositorio!")
        }

        await axios
       .get(`${ Url_API_Git }/repos/${ newRepo }`)
        .then((res) => {

            //Verifica se tem algum repositorio duplicado
            const hasRepo = repositorios.find(repo => repo.name === newRepo)
            if(hasRepo){
                throw new Error("Repositorio duplicado")};

            const data = {
                name: res.data.full_name
            };
            
            setRepositorios([...repositorios, data]);
            setNewRepo('');
        }).catch((err) => {
            setAlert(true)
            console.log("Deu erro", err)
        })
        setLoading(false)
    }
    submit()
       
}, [newRepo, repositorios])

function handleInput(e){
    setNewRepo(e.target.value);
    setAlert(null);
}

const handleDelete = useCallback((repo) => {
    const find = repositorios.filter(r => r.name !== repo)
    setRepositorios(find)
}, [repositorios]);
    
    return(
        <Container>
            <h1>
                <GoMarkGithub />
                Main
            </h1>

            
            <Form onSubmit={handleSubmit} error = {alert}>
                < input 
                    type = "text" 
                    placeholder="Adicionar repositorio" 
                    value={newRepo}
                    onChange={handleInput}
                    />

                <ButtonSubmit loading = {loading ? 1 : 0}>
                    <GoPlus color="#fff" size={15}/>
                </ButtonSubmit>
            </Form>
            <List>
                {repositorios.map(repo => (
                    <li key = {repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <GoTrashcan size={15}/>
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to = {`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <GoTasklist size={17}/>
                        </Link>
                    </li>
                ))}
            </List>
        </Container>

    )
})

export default Main;