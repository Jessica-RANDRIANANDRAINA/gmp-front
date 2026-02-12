import { IPhase } from "../../types/Project";

 const calculateProjectCompletion = (
  phases: IPhase[],
  projectState?: string,
  currentValue?: number
): number => {
  // Projet stand by => ne pas recalculer
  if (projectState === "Stand by") return currentValue ?? 0;

  const validPhases = (phases || []).filter((p) => p.status !== "Stand by");

  if (validPhases.length === 0) return 0;

  // Toutes terminées => 100
  const allFinished = validPhases.every(
    (p) => p.status === "Terminé" || (p.progress ?? 0) === 100
  );
  if (allFinished) return 100;

  const total = validPhases.reduce((sum, p) => {
    const w = p.weight ?? 0;
    const prog = p.progress ?? 0;
    return sum + (w * prog) / 100;
  }, 0);

  return Math.round(total * 100) / 100;
};
export default calculateProjectCompletion;