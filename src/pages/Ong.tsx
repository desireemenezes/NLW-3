import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaFacebook} from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams, Link } from 'react-router-dom';


import happyMapIcon from '../utils/mapIcons'
import '../styles/pages/orphanage.css';
import Sidebar from "../components/sidebar";
import api from '../services/api';



interface Orphanage {
	name: string;
	latitude: number;
	longitude: number;
	about: string;
	instructions: string;
	opening_hours: string;
	open_on_weekends:boolean;
	whats_app: string;
	facebook: string;
	images: Array<{
		id: number;
		url: string;
	}>;
}

interface OrphanageParams {
	id: string;
}

export default function Orphanage() {

	const params = useParams<OrphanageParams>();
	const [orphanage, setOrphanage] = useState<Orphanage>();
	
	const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
		api.get(`ongs/${params.id}`).then((response) => {
			setOrphanage(response.data);
		});
	}, [params.id]);
	
	if(!orphanage){
		return <p>Carregando...</p>
	}
	
	return (
		<div id='page-orphanage'>
			
			<Sidebar />

			<main>
				<div className='orphanage-details'>
					<img
						src={orphanage.images[activeImageIndex].url}
						alt={orphanage.name}
					/>

					<div className='images'>
						{orphanage.images.map((image, index) => {
							return (
								<button key={image.id} className={activeImageIndex === index ? 'active' : ''} type='button'
								onClick={() => {
									setActiveImageIndex(index);
								}}
								>
								<img
									src={image.url}
									alt={orphanage.name}
								/>
							</button>
							);
						})}
					</div>

					<div className='orphanage-details-content'>
						<h1>{orphanage.name}</h1>
						<p>
							{orphanage.about}
						</p>

						<div className='map-container'>
							<Map
								center={[orphanage.latitude, orphanage.longitude]}
								zoom={16}
								style={{ width: "100%", height: 280 }}
								dragging={false}
								touchZoom={false}
								zoomControl={false}
								scrollWheelZoom={false}
								doubleClickZoom={false}
							>
								<TileLayer
									url={`https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
								/>
								<Marker
									interactive={false}
									icon={happyMapIcon}
									position={[orphanage.latitude, orphanage.longitude]}
								/>
							</Map>

							<footer>
								<a target='blank' rel='noopener noreferrer' href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
							</footer>
						</div>

						<hr />

						<h2>Instruções para visita</h2>
						<p>
							{orphanage.instructions}õ
						</p>

						<div className='open-details'>
							<div className='hour'>
								<FiClock size={32} color='#15B6D6' />
								Segunda á Sexta <br />
								{orphanage.opening_hours}
							</div>
							{
									orphanage.open_on_weekends ? (
										<div className='open-on-weekends'>
											<FiInfo size={32} color='#39CC83' />
											Atendemos <br />
											fim de semana
										</div>
									) : (
										<div className='open-on-weekends dont-open'>
											<FiInfo size={32} color='#FF6690' />
											Não atendemos <br />
											fim de semana
										</div>
									)
							}
						</div>
{						orphanage.whats_app ? (
						<a href={`https://wa.me/${orphanage.whats_app}`}  target="_blank" className="style" rel='noopener noreferrer'>
						<button type='button' className='contact-button'>
							<FaWhatsapp size={20} color='#FFF' />
							WhatsApp
						</button>
						</a> ) : (
							''
						)}

{						orphanage.facebook ? (
						<a href={`${orphanage.facebook }`} target="_blank" className="style" rel='noopener noreferrer'>
						<button type='button' className='contact-button-face'>
							<FaFacebook size={20} color='#FFF' />
							Facebook
						</button>
						</a> ) : (
							''
						)}
					</div>
				</div>
			</main>
		</div>
	);
}