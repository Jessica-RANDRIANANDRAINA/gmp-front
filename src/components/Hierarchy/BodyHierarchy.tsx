import { useEffect, useState } from "react";
import { UserInterface } from "../../types/user";

const BodyHierarchy = ({ userData }: { userData: Array<any> }) => {
  const [superior, setSuperior] = useState<Array<UserInterface>>([]);
  const [underline, setUndeline] = useState<Array<UserInterface>>([]);
  const [userSelected, setUserSelected] = useState<UserInterface | null>(null);

  useEffect(() => {
    userData?.forEach((user) => {
      if (user.poste === "Directeur Général" && user.name.includes("Daniel")) {
        if (!superior?.find((sup) => sup?.id === user?.id)) {
          setSuperior([...superior, user]);
          setUserSelected(user);
        }
      }
    });
  }, [userData]);

  useEffect(() => {
    const underlines = userData?.filter(
      (user) => user?.superiorId === userSelected?.id
    );
    setUndeline(underlines);
  }, [superior]);

  useEffect(() => {
    if (userSelected) {
      console.log(userSelected);
      // Garde uniquement le supérieur fixe (Directeur nommé Daniel)
      const director = superior.find(
        (user) =>
          user.poste === "Directeur Général" && user.name.includes("Daniel")
      );
      const newSuperiors = director ? [director] : [];

      let currentUser = userSelected;

      // Ajoute les supérieurs successifs jusqu'à la personne sans supérieur
      while (currentUser?.superiorId) {
        const nextSuperior = userData.find(
          (user) => user.id === currentUser.superiorId
        );
        if (
          nextSuperior &&
          !newSuperiors.some((sup) => sup.id === nextSuperior.id)
        ) {
          newSuperiors.push(nextSuperior);
          currentUser = nextSuperior;
        } else {
          break;
        }
      }

      // Ajoute la personne sélectionnée à la fin du tableau
      if (!newSuperiors.some((sup) => sup.id === userSelected.id)) {
        newSuperiors.push(userSelected);
      }

      setSuperior(newSuperiors);
    }
  }, [userSelected]);
  return (
    <div className=" mt-4 flex flex-col justify-center gap-2 items-center">
      {/* ===== DIRECTOR START ===== */}
      <div className="flex flex-col gap-2">
        {superior?.map((sup) => (
          <button
            key={sup?.id}
            className="border  flex flex-col p-4 border-neutral-200 min-w-80"
            onClick={() => {
              setUserSelected(sup);
            }}
          >
            <span className="text-start">{sup?.name}</span>
            <span className="text-xs text-start text-slate-500">
              {sup?.poste}
            </span>
          </button>
        ))}
      </div>
      {/* ===== DIRECTOR END ===== */}
      {/* ===== UNDERLINE START ===== */}
      {underline?.length > 0 && (
        <div className="border grid grid-cols-3 gap-4 p-4 border-neutral-200 w-full bg-slate-50">
          {underline?.map((user) => (
            <button
              key={user?.id}
              className="border bg-white flex flex-col p-4  border-neutral-200 min-w-80"
              onClick={() => {
                setUserSelected(user);
              }}
            >
              <span className=" text-start">{user?.name}</span>
              <span className="text-xs text-start text-slate-500">
                {user?.poste}
              </span>
            </button>
          ))}
        </div>
      )}
      {/* ===== UNDERLINE END ===== */}
    </div>
  );
};

export default BodyHierarchy;
