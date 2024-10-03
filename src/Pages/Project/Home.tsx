import ProjectLayout from "../../layout/ProjectLayout";

const Home = () => {
  return (
    <ProjectLayout>
      <div className="grid place-items-center h-[50vh] font-bold text-2xl">
        <div className="flex flex-col justify-center items-center">
          <span>Bienvenue dans le G.M.P</span>
          <span className="text-base font-medium">Gestion et management de projet</span>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default Home;
