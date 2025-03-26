import * as React from "react";

// Definimos la interfaz de los props del componente SVG
interface FrameRotationProps extends React.SVGProps<SVGSVGElement> {
  // Aquí puedes agregar propiedades personalizadas, si las necesitas
  customProp?: string; // Ejemplo de propiedad adicional
}

const FrameRotation: React.FC<FrameRotationProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="6350 6400 1700 1700"
    enableBackground="new 6900 6400 900 700" // Aquí defines enableBackground fuera de style
    xmlSpace="preserve"
    {...props}
  >
    <style type="text/css">
      {
        "\n\t.st0{display:none;}\n\t.st1{display:inline;}\n\t.st2{fill:#CFCFCF;}\n\t.st3{fill:url(#SVGID_1_);}\n\t.st4{fill:#F89728;}\n\t.st5{fill:#EF3E42;}\n\t.st6{font-family:'Axiforma-Book';}\n\t.st7{font-size:43.4004px;}\n\t.st8{font-family:'Axiforma-Bold';}\n\t.st9{font-size:91.814px;}\n\t.st10{font-size:82.3648px;}\n\t.st11{font-size:85.3525px;}\n\t.st12{clip-path:url(#SVGID_00000019668936189817292800000014309154213418530189_);fill:#E49F44;}\n"
      }
    </style>

    <g id="Layer_4">
      <g>
        <g>
          <path
            className="st4"
            d="M7193.73,7753.63c-64.25-180.05-253.96-282.54-439.02-238.69l-264.19,81.77l-0.11-0.38 c-76.6,16.33-154.1-22.51-187.48-92.52l-125.76,80.38c-92.68,71.22-116.83,204.43-52.69,304.69 c64,100.03,193.25,133.03,296.42,79.26l0.39,0.38l313.64-200.59c146.12-80.15,316.86-80.54,459.17-13.18L7193.73,7753.63z"
          />
          <path
            className="st4"
            d="M8275.62,6512.62c-65.04-101.81-197.62-134.02-301.86-76.17l-0.38-0.52l-277.27,177.17 c-0.18,0.23-0.58,0.32-0.86,0.49c-152.55,97.63-337.69,102.8-489.92,30.12c66.15,189.72,271.11,294.51,464.71,234.59 c0.09,0,0.38-0.09,0.58-0.14l233.44-72.14l0.2,0.51c77.77-18.87,157.5,19.77,191.66,90.66l101.41-64.88 c3.04-1.8,20.47-13.15,20.47-13.15l-0.22-0.11C8314.35,6748.91,8340.92,6614.65,8275.62,6512.62z"
          />
        </g>
        <path
          className="st5"
          d="M6435.42,6426.59l179.6,281.08c96.39,151.99,101.54,335.93,29.39,487.43 c188.47-66.44,292.51-270.06,233.85-462.77l-73.12-236.64l0.49-0.09c-18.98-77.88,19.77-157.68,90.93-191.72l-64.75-101.2 c-1.76-3.06-13.04-20.49-13.04-20.49l-0.2,0.07c-70.28-96.69-204.34-123.2-306.44-57.91c-101.83,65.11-134.04,197.68-76.13,301.93 L6435.42,6426.59z"
        />
        <path
          className="st5"
          d="M7968.08,7978.73l-172.97-270.31c-2.43-4.95-5.17-9.98-8.66-15.31c-97.15-151.85-102.58-335.93-31.06-487.74 l-10.12,3.19c-182.52,70.24-281.8,270.94-223.1,460.44c1.35,4.55,2.34,8.7,3.1,12.68l70.41,227.6l-0.4,0.13 c16.44,76.53-22.38,153.97-92.19,187.36l80.6,126.06c71.27,92.71,204.52,116.86,304.78,52.71 c99.99-64.05,133.09-193.19,79.25-296.57L7968.08,7978.73z"
        />
      </g>
    </g>
  </svg>
);

export default FrameRotation;
