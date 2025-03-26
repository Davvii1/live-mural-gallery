import * as React from "react";

// Definimos la interfaz de los props del componente SVG
interface LogoSienteLaEnergiaProps extends React.SVGProps<SVGSVGElement> {
  // Aquí puedes agregar propiedades personalizadas, si las necesitas
  title?: string;
}

const LogoSienteLaEnergia: React.FC<LogoSienteLaEnergiaProps> = ({
  title,
  ...props
}) => (
  <svg
    id="Layer_3"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="6900 7000 600 360"
    enableBackground=" new 0 0 1000 1000"
    xmlSpace="preserve"
    {...props}
  >
    <style type="text/css">
      {
        "\n\t.sta0{font-family:'Axiforma-Book';}\n\t.sta1{font-size:43.4004px;}\n\t.sta2{font-family:'Axiforma-Bold';}\n\t.sta3{font-size:91.814px;}\n\t.sta4{font-size:82.3648px;}\n\t.sta5{font-size:85.3525px;}\n\t.sta6{clip-path:url(#SVGID_00000101800712584443854920000014467165108910818224_);fill:#E49F44;}\n"
      }
    </style>
    <text transform="matrix(1 0 0 1 6911.3408 7080.459)" className="sta0 sta1">
      {title}
    </text>

    <text
      transform="matrix(1.0141 0 0 1 6898.5029 7165.2568)"
      className="sta2 sta4"
      style={{ fontFamily: "Axiforma-Black", color: "black" }}
    >
      {"ENERG\xCDA"}
    </text>
    <text transform="matrix(1 0 0 1 6905.748 7221.644)" className="sta0 sta1">
      {"QUE"}
    </text>
    <text
      transform="matrix(1.05 0 0 1 7008.1074 7234.3379)"
      className="sta2 sta4"
      style={{ fontFamily: "'Axiforma-Black'" }}
    >
      {"CRECE"}
    </text>
    <text
      transform="matrix(1.0432 0 0 1 6900.0557 7308.5498)"
      className="sta2 sta5"
      style={{ fontFamily: "'Axiforma-Black'" }}
    >
      {"CONTIGO"}
    </text>
    <g>
      <defs>
        <rect
          id="SVGID_1_"
          x={7319.65}
          y={7078.28}
          width={175.14}
          height={267.45}
        />
      </defs>
      <clipPath id="SVGID_00000029727468736237070650000000317346507711337865_">
        <use
          xlinkHref="#SVGID_1_"
          style={{
            overflow: "visible",
          }}
        />
      </clipPath>
      <path
        style={{
          clipPath:
            "url(#SVGID_00000029727468736237070650000000317346507711337865_)",
          fill: "#E49F44",
        }}
        d="M7483.26,7088 l-38.27,65.96c-1.74,3.01-1.75,6.72-0.01,9.73c1.73,3.01,4.95,4.87,8.42,4.87h27.39l-124.54,167.45h-17.76l65.54-108.12 c1.82-3,1.88-6.75,0.16-9.81c-1.72-3.06-4.96-4.95-8.47-4.95h-36.38l35.81-123.38c0.3-1.03,1.26-1.75,2.33-1.75H7483.26z  M7487.48,7078.28h-90c-5.41,0-10.16,3.57-11.67,8.76l-36.71,126.49c-1.35,4.66,2.15,9.32,7,9.32h39.62l-70.21,115.82l4.13,7.06 h29.13h0.04c1.37,0,2.77-0.59,3.81-1.99l128.86-173.26c3.58-4.81,0.15-11.64-5.85-11.64h-32.23l40.38-69.61 C7496.61,7084.36,7493.1,7078.28,7487.48,7078.28"
      />
      <path
        style={{
          clipPath:
            "url(#SVGID_00000029727468736237070650000000317346507711337865_)",
          fill: "#E49F44",
        }}
        d="M7464.63,7089.23 l-40.38,69.61h32.23c5.99,0,9.43,6.83,5.85,11.64l-128.86,173.26c-3.33,4.48-10.36,0.72-8.48-4.54l41.58-116.35h-39.62 c-4.85,0-8.35-4.66-7-9.32l36.71-126.48c1.51-5.19,6.26-8.76,11.67-8.76h90C7463.94,7078.28,7467.45,7084.37,7464.63,7089.23"
      />
    </g>
  </svg>
);
export default LogoSienteLaEnergia;
