import { useEffect, useState } from "react";
import { Container, Owner, Loading, BackButton, 
    IssuesList, PageAction, FilterList } from "./styles";
import {Url_API_Git} from "../../constants/urlAPI";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";


export default function Repositorio({match}){
    const {repositorio} = useParams();

    const [repositorios, setRepositorios] = useState({});
    const [issues,setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false},
      ]);
    const [filterIndex, setFilterIndex] = useState(0);
    
    useEffect(() => {
        async function load(){
            const [repositorioData, issuesData] = await Promise.all([
                axios.get(`${ Url_API_Git }/repos/${ repositorio }`),
                axios.get(`${ Url_API_Git }/repos/${ repositorio }/issues`, {
                    params:{
                        state:filters.find(f => f.active).state,
                        per_page: 5
                    }
                })
            ]);
            setRepositorios(repositorioData.data);
            setIssues(issuesData.data)
            setLoading(false)
        }

        load();
    }, [filters, repositorio])

    useEffect(() => {
        async function loadIssue(){
            const response = await axios.get(`${ Url_API_Git }/repos/${ repositorio }/issues`, {
                params:{
                    state:filters[filterIndex].state,
                    page,
                    per_page: 5
                }
            })
            setIssues(response.data)
        }
        loadIssue();
    },[filterIndex, filters, repositorio, page])

    
    function handleFilter(index){
        setFilterIndex(index);
    }

    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page + 1);
    }

    if(loading){
        return(
        <Loading>
            <h1>Carregando...</h1>
        </Loading>
        )
    }

    return(
        <Container>
            <BackButton to = "/">
                <GoChevronLeft size={25}/>
            </BackButton>

            <Owner>
                <img 
                    src={repositorios.owner.avatar_url}
                    alt = {repositorios.owner.login}
                />
                <h1>{repositorios.name}</h1>
                <p>{repositorios.description}</p>
            </Owner>
            <FilterList>
                {filters.map((filter, index) => (
                    <button
                        type="button"
                        key={filter.label}
                        onClick={()=> handleFilter(index)}
                    >
                        {filter.label}
                    </button>
          ) )}
            </FilterList>
            <IssuesList>
                {issues.map(issues => {
                    return(
                    <li key = {String(issues.id)}>
                        <img 
                            src = {issues.user.avatar_url} 
                            alt = {issues.user.login}
                        />
                        <div>
                            <strong>
                                <a href = {issues.html_url}>{issues.title}</a>
                                {issues.labels.map( label => {
                                    return(
                                    <span key = {String(label.id)}>label.name</span>
                                    )
                                })}
                            </strong>
                            <p>{issues.user.login}</p>
                        </div>
                    </li>
                    )
                })}

            </IssuesList>
            <PageAction>
                <button 
                    type  = "button" 
                    onClick={() => handlePage('back')}
                    disabled = {page < 2}
                >
                    Voltar
                </button>
                <button type  = "button" onClick={() => handlePage('next')}>
                    Próxima
                </button>
            </PageAction>
        </Container>
    )
}
