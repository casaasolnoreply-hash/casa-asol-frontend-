import { useApp } from "../context/AppContext";
import { DARK } from "../constants/theme";
import TopBar from "../components/layout/TopBar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import GuatemalaFrame from "../components/layout/GuatemalaFrame";
import { HuipilStripe } from "../components/ui/GuatemalanMotifs";

const SECTION_STYLE = { marginBottom: 28 };
const H2_STYLE = { fontSize: 18, fontWeight: 700, color: DARK, margin: "0 0 10px" };
const P_STYLE = { fontSize: 14.5, lineHeight: 1.8, color: "#444", margin: "0 0 10px" };

function Terminos({ siteName }) {
  return (
    <>
      <div style={SECTION_STYLE}>
        <p style={P_STYLE}>
          Estos Términos y Condiciones regulan el uso del sitio web de {siteName} ("la Asociación"). Al navegar
          o utilizar este sitio, aceptas los términos descritos a continuación.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>1. Objeto del sitio</h2>
        <p style={P_STYLE}>
          Este sitio tiene como finalidad informar sobre los programas, actividades y labor social de la Asociación,
          así como facilitar el contacto, la solicitud de voluntariado y la recepción de donaciones o patrocinios.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>2. Uso del sitio</h2>
        <p style={P_STYLE}>
          El usuario se compromete a utilizar el sitio de forma lícita, sin realizar actividades que puedan dañar,
          inutilizar o sobrecargar el sitio, ni acceder a áreas restringidas (como el panel administrativo) sin
          autorización.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>3. Propiedad intelectual</h2>
        <p style={P_STYLE}>
          Los textos, imágenes, logotipos y demás contenidos publicados en este sitio son propiedad de {siteName} o
          se utilizan con la autorización correspondiente. Queda prohibida su reproducción total o parcial sin
          consentimiento previo.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>4. Donaciones y patrocinios</h2>
        <p style={P_STYLE}>
          La información publicada sobre formas de donación y patrocinio tiene fines informativos. Cualquier
          transacción realizada fuera de este sitio (transferencia bancaria, depósito u otro medio) es
          responsabilidad de quien la efectúa; recomendamos siempre verificar los datos oficiales de la Asociación
          antes de realizar cualquier aporte.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>5. Modificaciones</h2>
        <p style={P_STYLE}>
          La Asociación podrá actualizar estos términos en cualquier momento. Los cambios serán publicados en esta
          misma página.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>6. Contacto</h2>
        <p style={P_STYLE}>
          Si tienes dudas sobre estos Términos y Condiciones, puedes escribirnos a través del formulario de contacto
          del sitio.
        </p>
      </div>
    </>
  );
}

function Privacidad({ siteName }) {
  return (
    <>
      <div style={SECTION_STYLE}>
        <p style={P_STYLE}>
          Esta Política de Privacidad y Cookies explica cómo {siteName} trata la información que recopila a través
          de este sitio web.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>1. Información que recopilamos</h2>
        <p style={P_STYLE}>
          Solo recopilamos la información que tú mismo nos proporcionas voluntariamente a través de los formularios
          del sitio (por ejemplo, nombre, correo electrónico o teléfono al contactarnos, solicitar acceso al panel
          administrativo o postularte como voluntario). No recopilamos datos de pago ni información bancaria a
          través de este sitio.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>2. Uso de la información</h2>
        <p style={P_STYLE}>
          La información recibida se utiliza únicamente para responder tu solicitud, gestionar el acceso al panel
          administrativo del personal autorizado, o dar seguimiento a la labor social de la Asociación. No vendemos
          ni compartimos tus datos con terceros con fines comerciales.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>3. Cookies</h2>
        <p style={P_STYLE}>
          Este sitio utiliza una cookie propia (almacenamiento local del navegador) únicamente para recordar que ya
          aceptaste este aviso y, si inicias sesión en el panel administrativo, para mantener tu sesión activa. No
          utilizamos cookies de publicidad ni de rastreo de terceros.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>4. Seguridad</h2>
        <p style={P_STYLE}>
          Las contraseñas del personal autorizado se almacenan de forma cifrada y el acceso al panel administrativo
          está protegido. Aun así, ningún sistema es 100% infalible; si detectas algo inusual, contáctanos de
          inmediato.
        </p>
      </div>
      <div style={SECTION_STYLE}>
        <h2 style={H2_STYLE}>5. Tus derechos</h2>
        <p style={P_STYLE}>
          Puedes solicitarnos en cualquier momento que corrijamos o eliminemos la información personal que nos
          hayas proporcionado, escribiéndonos a través del formulario de contacto del sitio.
        </p>
      </div>
    </>
  );
}

export default function LegalPage({ type }) {
  const { content } = useApp();
  const siteName = content?.brand?.siteName || "Casa ASOL";
  const title = type === "privacidad" ? "Política de Privacidad y Cookies" : "Términos y Condiciones";

  return (
    <GuatemalaFrame contentStyle={{ fontFamily: "'Segoe UI', sans-serif", color: "#333" }}>
      <TopBar />
      <Navbar />
      <HuipilStripe height={8} />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: DARK, margin: "0 0 8px" }}>{title}</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 36px" }}>
          Última actualización: {new Date().toLocaleDateString("es-GT", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        {type === "privacidad" ? <Privacidad siteName={siteName} /> : <Terminos siteName={siteName} />}
      </main>
      <Footer />
    </GuatemalaFrame>
  );
}
