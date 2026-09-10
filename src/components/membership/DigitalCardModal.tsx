import Modal from '../common/Modal';
import type { Socio } from '../../store/useMembershipStore';
import escudo from '../../assets/escudo.png';

interface DigitalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  socio: Socio;
}

export default function DigitalCardModal({ isOpen, onClose, socio }: DigitalCardModalProps) {
  const tieneFoto = Boolean(socio.foto);
  
  // Extraemos año de la fecha de vencimiento si existe, sino usamos próxima temporada
  const validez = socio.vencimiento 
    ? `Temporada ${new Date(socio.vencimiento).getFullYear() - 1}/${new Date(socio.vencimiento).getFullYear().toString().slice(2)}`
    : 'Temporada 2026/27';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Carné Digital" size="lg">
      <style>{`
        .dc-container {
          display: flex;
          flex-direction: column;
          gap: 25px;
          font-family: Arial, sans-serif;
          /* Centrar el contenido y permitir escala en móvil */
          align-items: center;
          width: 100%;
          overflow-x: auto;
          padding: 10px;
        }

        .dc-card-wrapper {
          transform-origin: top center;
        }

        @media (max-width: 700px) {
          .dc-card-wrapper {
            transform: scale(min(1, calc((100vw - 40px) / 650)));
            margin-bottom: calc(-380px * (1 - min(1, calc((100vw - 40px) / 650))));
          }
        }

        .dc-card {
          width: 650px;
          height: 380px;
          background-color: #1c2852;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          color: white;
          text-align: left;
        }

        .dc-card.dc-front::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 12px,
                    rgba(235, 94, 40, 0.9) 12px,
                    rgba(235, 94, 40, 0.9) 22px
                ),
                repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 10px,
                    rgba(46, 139, 87, 0.85) 10px,
                    rgba(46, 139, 87, 0.85) 18px
                );
            clip-path: polygon(0 0, 70% 0, 0 85%, 0 100%, 35% 100%, 100% 35%, 100% 100%, 0 100%);
            z-index: 1;
            pointer-events: none;
        }

        .dc-card.dc-back {
            display: flex;
            flex-direction: column;
            padding: 30px;
            box-sizing: border-box;
            justify-content: space-between;
        }

        .dc-card.dc-back::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 15px,
                    rgba(46, 139, 87, 0.1) 15px,
                    rgba(46, 139, 87, 0.1) 25px
                );
            z-index: 1;
            pointer-events: none;
        }

        .dc-card-bg-lines {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 15px,
                rgba(255, 255, 255, 0.03) 15px,
                rgba(255, 255, 255, 0.03) 30px
            );
            z-index: 1;
            pointer-events: none;
        }

        .dc-header-section {
            display: flex;
            align-items: center;
            padding: 20px 25px;
            position: relative;
            z-index: 2;
        }

        .dc-photo-container {
            width: 90px;
            height: 110px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            border: 3px solid rgba(255,255,255,0.9);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            flex-shrink: 0;
            margin-right: 15px;
        }

        .dc-photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .dc-club-info {
            display: flex;
            align-items: center;
            z-index: 2;
        }
        
        .dc-mini-logo {
            width: 40px;
            height: 40px;
            object-fit: contain;
            margin-right: 12px;
        }
        
        .dc-club-info.dc-no-photo .dc-mini-logo {
            width: 50px;
            height: 50px;
            margin-right: 15px;
        }

        .dc-club-text h2 {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 0.5px;
            line-height: 1.2;
            color: white;
        }
        
        .dc-club-info.dc-no-photo .dc-club-text h2 {
            font-size: 26px;
        }

        .dc-club-text p {
            margin: 2px 0 0 0;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #dcdcdc;
        }
        
        .dc-club-info.dc-no-photo .dc-club-text p {
            margin: 4px 0 0 0;
            font-size: 16px;
            letter-spacing: 1.5px;
        }

        .dc-main-logo {
            position: absolute;
            top: 15px;
            right: 25px;
            width: 105px;
            height: 105px;
            object-fit: contain;
            z-index: 2;
        }

        .dc-white-box {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            height: 130px;
            background: white;
            border-radius: 10px;
            color: #000;
            padding: 15px 25px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 3;
        }

        .dc-user-details {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .dc-row-field {
            display: flex;
            gap: 25px;
            font-size: 18px;
        }

        .dc-field-group {
            display: flex;
            gap: 8px;
            align-items: baseline;
        }

        .dc-field-label {
            font-weight: bold;
            color: #000;
        }

        .dc-field-value {
            color: #555;
            text-transform: uppercase;
        }

        .dc-qr-container {
            width: 90px;
            height: 90px;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .dc-qr-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* Reverso */
        .dc-back-header {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 12px;
        }

        .dc-back-title {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #ffffff;
            margin: 0;
        }

        .dc-back-logo {
            width: 45px;
            height: 45px;
            object-fit: contain;
        }

        .dc-benefits-list {
            position: relative;
            z-index: 2;
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .dc-benefits-list li {
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.08);
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 4px solid #eb5e28;
            color: white;
            margin: 0;
        }

        .dc-benefits-list li::before {
            content: "✓";
            color: #2e8b57;
            font-weight: bold;
            font-size: 16px;
        }

        .dc-back-footer {
            position: relative;
            z-index: 2;
            text-align: center;
            font-size: 11px;
            color: #a0aec0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 8px;
        }

        .dc-label-side {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
            margin-bottom: -15px;
            align-self: flex-start;
        }
      `}</style>

      <div className="dc-container">
        {/* ANVERSO */}
        <div className="dc-card-wrapper">
          <div className="dc-label-side">Anverso del Carné</div>
          <div className="dc-card dc-front">
              <div className="dc-card-bg-lines"></div>

              <div className="dc-header-section">
                  {tieneFoto && (
                      <div className="dc-photo-container">
                          <img src={socio.foto} alt="Foto de perfil" />
                      </div>
                  )}
                  
                  <div className={`dc-club-info ${!tieneFoto ? 'dc-no-photo' : ''}`}>
                      <img src={escudo} alt="Mini Logo" className="dc-mini-logo" />
                      <div className="dc-club-text">
                          {tieneFoto ? (
                              <>
                                  <h2>C.L. ARIDANE<br/>DESDE 1946</h2>
                                  <p>Socio Abonado</p>
                              </>
                          ) : (
                              <>
                                  <h2>C.L. ARIDANE</h2>
                                  <p>DESDE 1946 &nbsp;•&nbsp; Socio Abonado</p>
                              </>
                          )}
                      </div>
                  </div>
              </div>

              <img src={escudo} alt="Escudo Principal" className="dc-main-logo" />

              <div className="dc-white-box">
                  <div className="dc-user-details">
                      <div className="dc-row-field">
                          <div className="dc-field-group">
                              <span className="dc-field-label">Nombre:</span>
                              <span className="dc-field-value">{socio.nombre}</span>
                          </div>
                          <div className="dc-field-group">
                              <span className="dc-field-label">Apellido:</span>
                              <span className="dc-field-value">{socio.apellidos || ''}</span>
                          </div>
                      </div>
                      <div className="dc-row-field">
                          <div className="dc-field-group">
                              <span className="dc-field-label">Validez:</span>
                              <span className="dc-field-value">{validez}</span>
                          </div>
                          <div className="dc-field-group">
                              <span className="dc-field-label">Nro:</span>
                              <span className="dc-field-value">{socio.numeroSocio || socio.numSocio || '---'}</span>
                          </div>
                      </div>
                  </div>

                  <div className="dc-qr-container">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${socio.numeroSocio || socio.numSocio || socio.dni || 'socio'}`} alt="Código QR" />
                  </div>
              </div>
          </div>
        </div>

        {/* REVERSO */}
        <div className="dc-card-wrapper mt-4">
          <div className="dc-label-side">Reverso del Carné</div>
          <div className="dc-card dc-back">
              <div className="dc-card-bg-lines"></div>

              <div className="dc-back-header">
                  <h3 className="dc-back-title">BENEFICIOS DEL SOCIO</h3>
                  <img src={escudo} alt="Logo Club" className="dc-back-logo" />
              </div>

              <ul className="dc-benefits-list">
                  <li>Entrada gratuita a todos los encuentros en casa excepto semifinales y finales</li>
                  <li>Carnet de socio digital</li>
                  <li>Voz en la Asamblea General</li>
                  <li>Apoyo directo al Club de Lucha Aridane</li>
                  <li>Newsletter mensual del club</li>
              </ul>

              <div className="dc-back-footer">
                  C.L. Aridane • Info: www.claridane.es
              </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
