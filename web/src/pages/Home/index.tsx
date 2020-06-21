import React from 'react';
import {FiLogIn} from 'react-icons/fi'; /* pacote de icones mais famosas */
import {Link} from 'react-router-dom'; /* LINK para page */
import './styles.css';

import logo from '../../assets/logo.svg'; /* imagem logo */

//COMPONENTE EM FORMATO DE CONSTANTE

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">

                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn /> {/* icone */}
                        </span>
                        <strong>Casdastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>

        </div>

    )
}

export default Home;