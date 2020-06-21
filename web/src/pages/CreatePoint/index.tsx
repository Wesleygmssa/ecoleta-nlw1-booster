import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'; // algumas usabilidade do react
import { Link, useHistory } from 'react-router-dom'; //link de direcionamento de pagina
import { FiArrowLeft } from 'react-icons/fi'; // utlizando icones no react
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'; // api de mapa
import axios from 'axios'; // biblioteca para api
import api from '../../services/api'; // pegando do banco de dados //servives api.ts
import { LeafletMouseEvent } from 'leaflet'; // evento do mapa 
import './styles.css';
import logo from '../../assets/logo.svg'; // imagem


interface Items { // array ou objeto : manualmente informar tipo da variavel (typeScript)
    id: number;
    title: string;
    image_url: string;
}

interface UBGEUFResponse {
    sigla: string;
    nome: string;
}

interface UBGEUCityesponse {
    nome: string;
}


const CreatePoint = () => {

    /* ****  UseState onde faz a mudança de estado ***** */

    {  //items   //recebendo argumento de typagem
        // criando um estado para armazenar informações dentro do compenente.
        // recendo a resposta do useEffect, api http://localhost:3333/items <== banco de dados
    }
    const [items, setItems] = useState<Items[]>([]);
    const [ufs, setUfs] = useState<string[]>([]); // uf que vem da api do ibge pegando só a silga ex: BA
    const [cities, setCities] = useState<string[]>([]); // armazenamento de city
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })
    
    
    const [selectedItems, setSelectedItems] = useState<number[]>([]); 
    const [selectedUf, setSelectedUf] = useState('0'); // armazenar a uf = BA, SC, RJ  que usuário selecionou 
    const [seletedCity, setSelectedCity] = useState('0'); // aarmazenamento do que foi selecionado. 
    const [seletedPosition, setSeletedPosition] = useState<[number, number]>([0, 0]);

    const history = useHistory(); //direcionamento de página
   
    useEffect(() => { // fazendo chamada

        navigator.geolocation.getCurrentPosition(position => {//pegando a posição local do usuário

            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, [])

    /* *** UseEffect onde faz a chamada da api *** */  //primeiro parametro qual função desejo executar, segundo quando quero executar essa função
     //ITEMS BANCO DE DADOS
    useEffect(() => { 

        api.get('items').then(response => { //promisse  //http://localhost:3333/ ***items***
          
            setItems(response.data); 
        });

    }, []);// deixar o array vazio ela só executada uma unica vez

    useEffect(() => { 
        

        axios.get<UBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => { 

            const ufInitials = response.data.map(uf => uf.sigla); 
        
            setUfs(ufInitials); //iniciais da uf, enviado para  [const ufs]
        });
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que uf mudar

        if (selectedUf === '0') {
            return;
        }

        axios.get<UBGEUCityesponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {

                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);


            });

    }, [selectedUf]);// quandp tiver mudança na UF mudar automaticamente altera as cidades


    /* *** funcão manipulando select *** */ // fazendo a mudança de estado com função
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {

        const uf = event.target.value

        setSelectedUf(uf); // mudanda de estado do  (selectedUf)

        //informa no html as cidades usando o map

    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {

        const city = event.target.value

        setSelectedCity(city); // mudanda de estado do  (selectedUf)

    }

    function handleMapClick(event: LeafletMouseEvent) {

        setSeletedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) { //manipulando input
        // console.log(event.target.value, event.target.name,  )
        

        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value })
    }

    function handleSelectedItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item == id);
        
        if (alreadySelected >= 0) {

            const filteredItems = selectedItems.filter(item => item !== id); // remover

            setSelectedItems([...filteredItems]);
        } else {
            setSelectedItems([...selectedItems, id]); //add
        }


    }

    async function handleSubmit(event: FormEvent) { //envio para api
        event.preventDefault();

        const {name, email, whatsapp} = formData
        const uf = selectedUf;
        const city = seletedCity;
        const [latitude, longitude] = seletedPosition; //destruturando array
        const items = selectedItems;

        const data = {
                name,
                email,
                whatsapp,
                uf,
                city,
                latitude,
                longitude,
                items
        };

      await  api.post('points', data);

      alert('Ponto de coleta criado');
      history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
               <Link to="/" ><img src={logo} alt="Ecoleta" /></Link> 

                <Link to="/">
                    <FiArrowLeft />
                     Voltar para home
                 </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">

                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />

                    </div>
                    <div className="field-group">
                        <div className="field">

                            <label htmlFor="name">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />

                        </div>
                        <div className="field">

                            <label htmlFor="Whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />

                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={14} onClick={handleMapClick} >

                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                     
                        <Marker position={seletedPosition} />
                      
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>

                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf} /* valor do estado */
                                onChange={handleSelectUf} /* função de mudança */
                            >

                                <option value="0">Selecione um UF</option>

                                {ufs.map(uf => ( // para cada ufs um uf ex: BA, SC, RJ
                                    <option key={uf} value={uf}> {uf} </option>

                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={seletedCity}
                                onChange={handleSelectCity}
                            >

                                <option value="0">Selecione uma Cidade</option>

                                {cities.map(city => {
                                    return <option key={city} value={city}>{city}</option>
                                })}

                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítems de coleta</h2>
                        <span>Selecione um ou mais Ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => { // percorre cada item no array e retorna alguma coisa.
                            //sempre que faz map tem que ter propriedade key = pegando valor unico

                            return <li
                                key={item.id}
                                onClick={() => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            > {/* className="selected" */}

                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>

                        })}

                    </ul>

                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint;