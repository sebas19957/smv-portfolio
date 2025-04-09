"use client";

const MouseAnimation = () => {
  return (
    <svg
      width="18px"
      height="100%"
      viewBox="0 0 247 390"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}
    >
      {/* Barrita animada */}
      <path
        d="M123.359,79.775l0,72.843"
        style={{ fill: "none", stroke: "#fff", strokeWidth: 20 }}
      >
        <animateTransform
          attributeType="XML"
          attributeName="transform"
          type="translate"
          values="0,0; 0,100; 0,0"
          dur="1.5s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
          calcMode="spline"
          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
        />
      </path>

      {/* Contorno del mouse */}
      <path
        d="M236.717,123.359c0,-62.565 -50.794,-113.359 -113.358,-113.359c-62.565,0 -113.359,50.794 -113.359,113.359l0,143.237c0,62.565 50.794,113.359 113.359,113.359c62.564,0 113.358,-50.794 113.358,-113.359l0,-143.237Z"
        style={{ fill: "none", stroke: "#fff", strokeWidth: 20 }}
      />
    </svg>
  );
};

export default MouseAnimation;
