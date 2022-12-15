import { useContext, useEffect, useState } from "react";
import { ShipType } from "../ships/ship.types";
import { ShipContext } from "../ships/ShipProvider";
import { HexAnimatedShip } from "./HexAnimatedShip";
import { HexStaticShip } from "./HexStaticShip";

const NO_ANIMATIONS = -1;

export function HexShips({ ships }: { ships: ShipType[] }) {
  const { step, applyMovement } = useContext(ShipContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [pendingAnimations, setPendingAnimations] = useState(NO_ANIMATIONS);

  useEffect(() => {
    if (step !== currentStep) {
      setPendingAnimations(ships.length);
      setCurrentStep(step);
    }
  }, [currentStep, setPendingAnimations, ships.length, step]);

  useEffect(() => {
    if (pendingAnimations !== 0) return;
    applyMovement();
    setPendingAnimations(NO_ANIMATIONS);
  }, [applyMovement, pendingAnimations]);

  const isAnimating = pendingAnimations > 0;
  return (
    <>
      {ships.map((ship) =>
        isAnimating ? (
          <HexAnimatedShip key={ship.name} ship={ship} onFinish={() => setPendingAnimations((prev) => prev - 1)} />
        ) : (
          <HexStaticShip key={ship.name} ship={ship} />
        )
      )}
    </>
  );
}
