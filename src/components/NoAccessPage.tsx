import forbidden from "../../src/assets/forbidden.png";
const NoAccessPage = () => {
  return (
    <div className="w-full h-[100vh] absolute flex justify-center items-center bg-cover bg-center bg-fond">
      <div className="  p-4 flex flex-col justify-center items-center">
        <div>
          <img src={forbidden} alt="forbidden-image" className="w-70 h-70" />
        </div>
        <div
          className="text-bodydark1 font-bold text-7xl"
          style={{ textShadow: "4px 1px 2px rgba(100, 0, 0, 1)" }}
        >
          Error 403
        </div>
        <div className="font-bold flex flex-col justify-center items-center ">
          <span>Vous n'avez pas accès à cette page</span>
          <span>Veuillez vous reconnecter</span>
        </div>
      </div>
    </div>
  );
};

export default NoAccessPage;
