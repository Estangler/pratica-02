import { type Pokemon } from "../utils/types";
import { chipVariants, statsVariant } from "../utils/styles";
import { MAX_STATS } from "../utils/baseStats";
import Modal from "react-modal";

type PokemonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pokemon: Pokemon | null;
  captureRate: number | null;
};

export default function PokemonModal({
  isOpen,
  onClose,
  pokemon,
  captureRate,
}: PokemonModalProps) {
  if (!pokemon) return null;

  const principalType = pokemon.types[0].type.name;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-0 m-0"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          inset: "auto",
          padding: 0,
          border: "none",
          borderRadius: "16px",
          background: "transparent",
          width: "100%",
          maxWidth: "600px",
          overflow: "hidden",
        },
      }}
    >
      <div
        className={`${chipVariants[principalType as keyof typeof chipVariants]}`}
      >
        <header className="py-10 px-5">
          <span className="font-mono text-base text-txt-muted">
            #{pokemon.id.padStart(3, "0")}
          </span>
          <p className="text-2xl font-semibold text-txt-primary capitalize">
            {pokemon.name}
          </p>
          <div className="flex gap-2">
            {pokemon.types.map((types) => (
              <span
                key={types.type.name}
                className={`${chipVariants[types.type.name as keyof typeof chipVariants]} border rounded-[20px] py-1 px-2 text-xs font-semibold capitalize`}
              >
                {types.type.name}
              </span>
            ))}
          </div>
        </header>

        <div className="flex flex-col items-center mb-5">
          <div
            className={`h-65 w-65 border rounded-full flex items-center justify-center ${chipVariants[principalType as keyof typeof chipVariants]}`}
          >
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="animate-float h-65 w-65"
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border-t border-t-txt-muted py-5 px-5">
          <div className="flex gap-2 items-center justify-center pt-3">
            <div className="bg-surface-el rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
              <p>Altura</p>
              <span className="font-bold text-txt-primary">
                {pokemon.height / 10} m
              </span>
            </div>
            <div className="bg-surface-el text-sm rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
              <p>Peso</p>
              <span className="font-bold text-txt-primary">
                {pokemon.weight / 10} kg
              </span>
            </div>
            <div className="bg-surface-el text-sm rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
              <p>Habilidades</p>
              <span className="font-bold text-txt-primary text-[11px]">
                {pokemon.abilities[0]?.ability.name || "N/A"}
              </span>
            </div>
            <div className="bg-surface-el text-sm rounded-sm text-txt-muted py-1 px-5 uppercase text-[12px] flex-1">
              <p>Captura</p>
              <span className="font-bold text-txt-primary text-[11px]">
                {captureRate ? `${captureRate} / 255` : "N/A"}
              </span>
            </div>
          </div>
          <div>
            {pokemon.stats.map((stats) => {
              const max = MAX_STATS[stats.stat.name as keyof typeof MAX_STATS];
              const value = (stats.base_stat / max) * 100;

              return (
                <div className="w-full mt-2" key={stats.stat.name}>
                  <div className="flex justify-between">
                    <span
                      className={`text-txt-muted text-[12px] ${stats.stat.name === `hp` ? `uppercase` : `capitalize`}`}
                    >
                      {stats.stat.name}
                    </span>
                    <span className="text-txt-primary text-sm">
                      {stats.base_stat}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-txt-muted rounded-full">
                    <div
                      className={`${statsVariant[stats.stat.name as keyof typeof statsVariant]} h-1 rounded-full`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
